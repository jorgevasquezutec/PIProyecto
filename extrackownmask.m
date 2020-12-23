close all;
clear all;
imagen=imread('fotos/cells.jpg');
hsvi=rgb2hsv(imagen);
Mask = (hsvi(:,:,3)>0.068);
gray_image = rgb2gray(imagen);

J = imerode(Mask,strel('disk',14));
imshow(J);
h = imfreehand();
bw=createMask(h);
imwrite(bw,"spotT3.jpg");
imagesc(bw);
    







