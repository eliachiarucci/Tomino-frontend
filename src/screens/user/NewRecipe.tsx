import React, { useEffect, useState } from "react";
import FlexContainer from "flexcontainer-react";
import { Form, Input, Button, Space, Select, Switch, TimePicker, Tooltip, Upload, message, Rate, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import env from "../../env";
import recipeService from "../../services/recipe-service";
import { useHistory } from "react-router-dom";
const RecipeService = new recipeService();
const { TextArea } = Input;
const { Option } = Select;

const NewRecipe = () => {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const onFinish = (values: any) => {
    setLoading(true);
    try {
      values.steps.forEach((step: any) => {
        if (!step.timer) {
          step.time = 0;
          step.timer = false;
        } else step.time = moment.duration(step.time.format("HH:mm:ss")).asSeconds();
      });
      values.preparationtime = moment.duration(values.preparationtime.format("HH:mm:ss")).asSeconds();
      values.image = values.image[0].response.cloudinaryUrl;
    } catch (e) {
      setLoading(false);
      message.error("Something went wrong with the compilation of the forms, please fill all the required inputs");
      return;
    }
    console.log("Received values of form:", values);
    RecipeService.addRecipe(values)
      .then(response => history.push("/home"))
      .catch(err => {
        console.log(err.response.data.message);
        message.error(err.response.data.message);
        setLoading(false);
      });
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    if (e.fileList.length > 1) {
      e.fileList.shift();
    }
    return e && e.fileList;
  };

  const uploadUrl = () => {
    return env.SERVER_URL + "/upload";
  };

  const onChange = (value: any, values: any) => {
    setFormValue(values);
    try {
      const duration = values.steps[0].time.format("HH:mm:ss");
      console.log(moment.duration(duration).asSeconds());
    } catch (e) {}
  };

  useEffect(() => {
    console.log(formValue);
    console.log(form);
  }, [formValue]);

  const isTimerSet = (index: number) => {
    try {
      return form.getFieldsValue().steps[index].timer;
    } catch (e) {
      return false;
    }
  };

  const categoriesArray = [
    "Dessert",
    "Meat",
    "Pasta",
    "Pizza",
    "Vegetarian",
    "Vegan",
    "Appetizer",
    "Fish",
    "Bread",
    "Gluten-free",
    "Other"
  ];

  return (
    <FlexContainer type="vertical" alignItems="center" width="100vw" justifyContent="center">
      <h2>Add Recipe</h2>
      <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} onValuesChange={onChange} autoComplete="off">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please add a title" }]}>
          <Input type="text" placeholder="title" name="title" />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          valuePropName="file"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload a profile picture!" }]}
        >
          <Upload accept=".jpg, .jpeg, .png" multiple={false} name="image" action={uploadUrl} listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please add a description" }]}>
          <TextArea rows={4} placeholder="description" name="description" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please add a category" }]}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a category"
            optionFilterProp="children"
            //filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {categoriesArray.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="preparationtime" label="Preparation Time" rules={[{ required: true, message: "Please add a preparation time" }]}>
          <TimePicker defaultValue={moment("00:00:00", "HH:mm:ss")} />
        </Form.Item>
        <h4>Ingredients</h4>
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {fields.map(field => (
                <Space key={field.key} align="baseline">
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                  <Form.Item
                    {...field}
                    label="Name"
                    name={[field.name, "name"]}
                    fieldKey={[field.fieldKey, "name"]}
                    rules={[{ required: true, message: "Missing name" }]}
                  >
                    <Input style={{ width: 130 }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Quantity"
                    name={[field.name, "quantity"]}
                    fieldKey={[field.fieldKey, "quantity"]}
                    rules={[{ required: true, message: "Missing Quantity" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item {...field} label="Unit" name={[field.name, "unit"]} fieldKey={[field.fieldKey, "unit"]} initialValue="g">
                    <Select style={{ width: 120 }}>
                      <Option value="g">g</Option>
                      <Option value="kg">kg</Option>
                      <Option value="ml">ml</Option>
                      <Option value="l">l</Option>
                      <Option value="pieces">pieces</Option>
                    </Select>
                  </Form.Item>
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add ingredient
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <h4>Steps</h4>
        <Form.List name="steps">
          {(fields, { add, remove }) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {fields.map(field => (
                <Space key={field.key} align="baseline">
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                  <Form.Item
                    {...field}
                    label="Name"
                    name={[field.name, "name"]}
                    fieldKey={[field.fieldKey, "name"]}
                    rules={[{ required: true, message: "Missing name" }]}
                  >
                    <Input style={{ width: 130 }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Description"
                    name={[field.name, "description"]}
                    fieldKey={[field.fieldKey, "description"]}
                    rules={[{ required: true, message: "Missing description" }]}
                  >
                    <TextArea />
                  </Form.Item>

                  <Form.Item label="Timer" valuePropName="checked" name={[field.name, "timer"]}>
                    <Switch defaultChecked={false} />
                  </Form.Item>
                  <Tooltip title="If this step has a timer, it will be started at the moment the step is completed">
                    <QuestionCircleOutlined />
                  </Tooltip>

                  {isTimerSet(field.key) ? (
                    <Form.Item name={[field.name, "time"]} rules={[{ required: true, message: "Missing timer value" }]}>
                      <TimePicker defaultValue={moment("00:00:00", "HH:mm:ss")} />
                    </Form.Item>
                  ) : null}
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add steps
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <h4>Conservation time</h4>
        <Form.List name="conservationtimes">
          {(fields, { add, remove }) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {fields.map(field => (
                <Space key={field.key} align="baseline">
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                  <Form.Item
                    {...field}
                    label="Conservation Time (days)"
                    name={[field.name, "conservationtime"]}
                    fieldKey={[field.fieldKey, "conservationtime"]}
                    rules={[{ required: true, message: "Missing conservation time" }]}
                  >
                    <InputNumber type="number" min={0} max={60} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Storage location"
                    name={[field.name, "storagelocation"]}
                    fieldKey={[field.fieldKey, "storagelocation"]}
                    initialValue="fridge"
                  >
                    <Select defaultValue="fridge" style={{ width: 120 }}>
                      <Option value="fridge">fridge</Option>
                      <Option value="refrigerator">refrigerator</Option>
                      <Option value="cool and dry place">cool and dry place</Option>
                    </Select>
                  </Form.Item>
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add conservation time
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.Item label="Difficulty" name="difficulty" rules={[{ required: true, message: "Please add a difficulty rating" }]}>
          <Rate />
        </Form.Item>
        <Form.Item label="Calories (per serving)" name="calories">
          <InputNumber type="number" min={0} max={2000} />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode" />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" className="form-button">
            Create Recipe
          </Button>
        </Form.Item>
      </Form>
    </FlexContainer>
  );
};

export default NewRecipe;
