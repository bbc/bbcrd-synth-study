# Synthesis

In this section you will find out how to use a trained model in order to synthesize speech from text. As mentioned in the main [README](../README.md) file, the code required for synthesizing the voice was written in Python 2.

### Prerequisites

The code for synthesizing voice can be found in the same repo as we mentioned in the [train](../train) section. If you haven't done so already, or you prefer to separate your train and synthesis working folders, clone [our DC_TTS fork](https://github.com/bbc/dc_tts):
```
git clone https://github.com/bbc/dc_tts
cd dc_tts
```

### 1. Acquiring a model
To learn how to create and download a model, please visit the [train](../train) section. If you just want to quickly experiment with a pre-trained model you can download our [pretrained model](https://www.dropbox.com/s/dum57sx8cmtugol/ljspeech_model_v1.2.tar.gz?dl=0). 

*(Note: The model found in Kyubyong's repo was trained using a different set of symbols, hence, it would be incompatible with our current setup.)*

You should end up with a `models` folder with the following structure:

```
models
├──LJ01-1
└──LJ01-2
```

Where `LJ01-1` contains the Text\_To\_Mel model files and `LJ01-2` contains the SSRN model files.

### 2. Install Anaconda
If you haven't done it already, please install Anaconda. See [here](https://docs.anaconda.com/anaconda/install/) for more details.

### 3. Setup a Python2.7 Anaconda environment
```
conda create -n dc_tts_synthesis python=2.7
conda activate dc_tts_synthesis
```
**Note:** You will have to run the `conda activate dc_tts_synthesis` command every time before you start working on this project in a new shell.

### 4. Install requirements
If you are on a CPU-only machine, install the requirements as such:
```
pip install -r requirements_cpu.txt
```

Otherwise, if you are on a GPU-equiped machine, install requirements as such:
```
pip install -r requirements.txt
```

The basic difference is that with requirements.txt, tensorflow_gpu will be installed instead of tensorflow.

### 5. Copy your trained model

Copy your trained model (or our pre-trained one) into a `models` folder in the root of your copy of [dc_tts](https://github.com/bbc/dc_tts).

### 6. Run synthesize_example.py

Update `synthesize-example.py` with the path of your models and simply run it:
```
python2 synthesize-example.py
```


