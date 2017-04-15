import os
import sys
import tensorflow as tf
import numpy as np
from PIL import Image
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, MaxPooling2D
from keras.utils import np_utils
from keras.optimizers import Adam
from keras.models import model_from_json
model = model_from_json(open('./architecture.json').read())
model.load_weights('./weight.h5')

print("load ok")

def predicate(filename):
	pic = Image.open(filename)
	pic = pic.resize((128, 128))
	pic_gray = pic.convert('L')
	pic_gray = np.array(pic_gray)
	print(pic_gray.shape)
	pic = np.array(pic)
	pic = np.dstack((pic[:,:,0],pic[:,:,1],pic[:,:,2],pic_gray))
	pic = pic.reshape(1,128,128,4).astype('float32')
	pic = pic / 255
	pre = model.predict_classes(pic,verbose=0)
	return pre[0]

while True:
	filename = input()
	print(predicate(filename))
	sys.stdout.flush()



