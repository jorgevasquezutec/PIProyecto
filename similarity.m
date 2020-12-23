close all;
clear all;
image1 = imread('PPTFOTOS/spots/spotO1.jpg');
image1 = imbinarize(image1);
image2 = imread('PPTFOTOS/spots/spotT1.jpg');
image2 = imbinarize(image2);
res = jaccard(image1, image2);
figure; 
imshowpair(image1, image2) 
title(['Spot1-Jaccard Index = ' num2str(res)])

image1 = imread('PPTFOTOS/spots/spotO2.jpg');
image1 = imbinarize(image1);
image2 = imread('PPTFOTOS/spots/spotT2.jpg');
image2 = imbinarize(image2);
res = jaccard(image1, image2);
figure; 
imshowpair(image1, image2) 
title(['Spot2-Jaccard Index = ' num2str(res)])


image1 = imread('PPTFOTOS/spots/spotO3.jpg');
image1 = imbinarize(image1);
image2 = imread('PPTFOTOS/spots/spotT3.jpg');
image2 = imbinarize(image2);
res = jaccard(image1, image2);
figure; 
imshowpair(image1, image2) 
title(['Spot3-Jaccard Index = ' num2str(res)])
