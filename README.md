# TensorFlow MNIST
A homemade digit recognition system

_Includes data generation, training, teaching, and prediction_

Read about MNIST [here](http://yann.lecun.com/exdb/mnist/)

## Inspiration
Why do this in the first place? Doesn't a better MNIST dataset already exist?

Yes. Much larger, much higher accuracy MNIST datasets exist. This was created for two reasons:
- I wanted experience generating a dataset myself
- I wanted to see what conditions (image resolution, dataset size, training time) would contribute to better results

## Neural Network Structure
Conv2D (15x15, relu) -> Flatten -> Dense (64, relu) -> Dense (10, softmax)

Using a convolution layer is very common for image based classifiers. It allows for a better understanding of spacially related information.
