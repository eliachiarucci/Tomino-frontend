import React, { useEffect, useState } from "react";
import FlexContainer from "flexcontainer-react";
import { Form, Input, Button, Space, Select, Switch, TimePicker, Tooltip, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import env from "../../env";
const { TextArea } = Input;
const { Option } = Select;

const NewRecipe = () => {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState<any>();

  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
    values.steps.forEach((step: any) => {
      if (!step.timer) {
        step.time = 0;
        step.timer = false;
      } else step.time = moment.duration(values.steps[0].time.format("HH:mm:ss")).asSeconds();
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
  }, [formValue]);

  const isTimerSet = (index: number) => {
    try {
      return form.getFieldsValue().steps[index].timer;
    } catch (e) {
      return false;
    }
  };

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

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please add a description" }]}
        >
          <TextArea rows={4} placeholder="description" name="description" />
        </Form.Item>
        <h4>Ingredients</h4>
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.area !== curValues.area || prevValues.steps !== curValues.steps
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        label="Name"
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={[{ required: true, message: "Missing name" }]}
                      >
                        <Input style={{ width: 130 }}></Input>
                      </Form.Item>
                    )}
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Quantity"
                    name={[field.name, "Quantity"]}
                    fieldKey={[field.fieldKey, "Quantity"]}
                    rules={[{ required: true, message: "Missing Quantity" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Unit"
                    name={[field.name, "Unit"]}
                    fieldKey={[field.fieldKey, "Unit"]}
                    initialValue="g"
                  >
                    <Select defaultValue="g" style={{ width: 120 }}>
                      <Option value="g">g</Option>
                      <Option value="kg">kg</Option>
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
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.area !== curValues.area || prevValues.steps !== curValues.steps
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        label="Name"
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={[{ required: true, message: "Missing name" }]}
                      >
                        <Input style={{ width: 130 }}></Input>
                      </Form.Item>
                    )}
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Description"
                    name={[field.name, "Description"]}
                    fieldKey={[field.fieldKey, "Description"]}
                    rules={[{ required: true, message: "Missing description" }]}
                  >
                    <Input />
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

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
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

        <Form.Item label="Tags" name="tags">
          <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode"></Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="form-button">
            Create Recipe
          </Button>
        </Form.Item>
      </Form>
    </FlexContainer>
  );
};

export default NewRecipe;
