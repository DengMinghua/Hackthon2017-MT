# -*- coding: utf-8 -*-
from PIL import Image
from pylab import *
import copy

# 读取图像到数组中
def hist_b(pic):
	im = array(pic)

	r = im[:,:,0]

	g = im[:,:,1]

	b = im[:,:,2]
#计算各通道直方图
	imhist_r,bins_r = histogram(r,256,normed=True)
	imhist_g,bins_g = histogram(g,256,normed=True)
	imhist_b,bins_b = histogram(b,256,normed=True)
#各通道累积分布函数
	cdf_r = imhist_r.cumsum()
	cdf_g = imhist_g.cumsum()
	cdf_b = imhist_b.cumsum()
	#累计函数归一化（由0～1变换至0~255）
	cdf_r = cdf_r*255/cdf_r[-1]
	cdf_g = cdf_g*255/cdf_g[-1]
	cdf_b = cdf_b*255/cdf_b[-1]
	cdf_m = (cdf_r+cdf_g+cdf_b)/3;
	#绘制直方图均衡化之后的直方图
	im_r = interp(r.flatten(),bins_r[:256],cdf_m)
	im_g = interp(g.flatten(),bins_g[:256],cdf_m)
	im_b = interp(b.flatten(),bins_b[:256],cdf_m)
	#均衡化之后的通道图
	im_r = im_r.reshape([im.shape[0],im.shape[1]])
	im_g = im_g.reshape([im.shape[0],im.shape[1]])
	im_b = im_b.reshape([im.shape[0],im.shape[1]])
	#均衡化之后的图像
	im_p = copy.deepcopy(im)
	im_p[:,:,0] = im_r
	im_p[:,:,1] = im_g
	im_p[:,:,2] = im_b
	im_p = Image.fromarray(im_p)
	return im_p