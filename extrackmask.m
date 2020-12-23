close all;
clear all;
imshow(imread('fotos/cells.jpg'))
h = imfreehand();
bw=createMask(h);
imwrite(bw,"spotO3.jpg");
imagesc(bw);