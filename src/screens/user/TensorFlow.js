import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';
import { Button } from 'antd';
import Axios from 'axios';
import authService from '../../services/auth-service';
const AuthService = new authService();

const TensorFlow = (props) => {
    console.log(props.loggedInUser);
    let baseRecognizer, transferRecognizer;
    const start1 = async () => {
        baseRecognizer = speechCommands.create('BROWSER_FFT');
        await baseRecognizer.ensureModelLoaded();
        transferRecognizer = baseRecognizer.createTransfer('colors');
        console.log(transferRecognizer);
    }
    start1();
    async function collect() {
        await transferRecognizer.collectExample('_background_noise_');
        console.log(transferRecognizer.countExamples());
    }
    
    async function collectHeyTomino() {
        await transferRecognizer.collectExample('tomino');
        console.log(transferRecognizer.countExamples());
    }

    async function start() {
        console.log(transferRecognizer);
        const serialized = transferRecognizer.serializeExamples();
        localStorage.setItem("serialized", serialized);
        await transferRecognizer.train({
      epochs: 1000,
      callback: {
        onEpochEnd: async (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
        }
      }
    });

    transferRecognizer.save(tf.io.http(
        "http://localhost:5000/tsmodel/upload",
        {requestInit: {method: 'POST', credentials: "include"}}))
        .then((data) => console.log(data));
    
    // After the transfer learning completes, you can start online streaming
    // recognition using the new model.
    await transferRecognizer.listen(result => {
        console.log("starting to listen", result.scores);
      // - result.scores contains the scores for the new vocabulary, which
      //   can be checked with:
      const words = transferRecognizer.wordLabels();
      // `result.scores` contains the scores for the new words, not the original
      // words.
      for (let i = 0; i < words; ++i) {
        console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
      }
    }, {probabilityThreshold: 0.998});
    }

const testauth = () => {
    Axios.post("http://localhost:5000/testauth");
}

const testauthget = () => {
    AuthService.isAuthenticated();
}

    return (
        <div>
            <Button onClick={collect}>CollectBackground</Button>
            <Button onClick={collectHeyTomino}>CollectBackground</Button>
            <Button onClick={start}>CollectBackground</Button>
            <Button onClick={testauth}>TESTAUTH</Button>
            <Button onClick={testauthget}>TESTAUTH</Button>
        </div>
    );
};

export default TensorFlow;