function n = newCount(ruta)
imagen = imread(ruta);
figure
imshow(imagen)
title('Imagen Ingresada')
%borrar manchas
hsv = rgb2hsv(imagen);
imagesc(hsv(:,:,3))
title('hsv')

%convertimos blanco y negro
gray_image = rgb2gray(imagen);
figure,imshow(gray_image)
title('Imagen en escala de grises')
gray_image = imadjust(gray_image,[0.3 0.7],[]);
figure,imshow(gray_image)
title('Imagen con colores mas intensos')
[labeledImage, numbercircles] = bwlabel(gray_image);
m = regionprops(labeledImage);
disp(numbercircles)


bin = imbinarize(gray_image);
bin = imclearborder(bin);
bin = bwareaopen(bin, 10);
[labeledImage, numbercircles] = bwlabel(bin);
m = regionprops(labeledImage);
figure,imshow(bin)
title('bin')
disp(numbercircles)
