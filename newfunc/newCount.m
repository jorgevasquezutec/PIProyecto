function n = newCount(ruta)
imagen = imread(ruta);
figure
imshow(imagen)
title('Imagen Ingresada')

%convertimos blanco y negro
gray_image = rgb2gray(imagen);
figure,imshow(gray_image)
title('Imagen en escala de grises')


[~, threshold] = edge(gray_image, 'canny');
cc = 1.5;
imagen_bordeada = edge(gray_image,'canny', threshold*cc);
imagen_bordeada1= imclearborder(imagen_bordeada);
figure
imshow(imagen_bordeada1)
title('Imagen bordeada')

% Filling the holes of above processed image
imagen_sin_agujeros = imfill(imagen_bordeada1,'holes');


%Extraemos los circulos con area entre el rango mostrado. 
stats = regionprops('table',imagen_sin_agujeros,'Area');
stats = sortrows(stats,'Area');
disp(stats);

extractCircle = bwpropfilt(imagen_sin_agujeros,'Area',[0 499]);
figure
imshow(extractCircle)
title('RBC Extraídas')

% Contar el numero de circulos
f = bwconncomp(extractCircle, 4);
RBC_counter = f.NumObjects;
fprintf('%s %d\n','Cantidad de RBC = ',RBC_counter);