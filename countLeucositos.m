function n=countLeucositos(ruta)
    A = imread(ruta);
    figure
    imshow(A)
    %convertimos blanco y negro
    I = rgb2gray(A);
    figure
    imshow(I)
    %aplicamos un ajuste de contraste
    I = adapthisteq(I);
    figure
    imshow(I)
    %eliminamos los bordes
    I = imclearborder(I);
    figure
    imshow(I)
    %eliminamos el ruido mediante un filtrado adaptivo utilizando
    %una ventana de pizeles
    I = wiener2(I, [5 5]);
    figure
    imshow(I)
    %aplicamos la tecnica de binarizacion para extrear los perimetros
    %de las celdas
    bw = imbinarize(I, graythresh(I));
    %imbinarize %im2bw
    figure
    imshow(bw)
    %llenamos los agujeros
    bw2 = imfill(bw,'holes');
    figure
    imshow(bw2)
    %apertura morphologica usando un kernel de disco
    bw3 = imopen(bw2, strel('disk',2));
    figure
    imshow(bw3)
    %eliminamos todos las celdas menores a 10 pixeles
    bw4 = bwareaopen(bw3, 100);
    %probar con el region prop.
    %ver los grupos de celdas que estas sobreagurpadas, para suporponer los
    %perimetor se utilizo imoverlay
    %%orbersar ...
    bw4_perim = bwperim(bw4);
    overlay1 = imoverlay(I, bw4_perim, [1 .3 .3]);
    % figure
    % imshow(overlay1)
    % algorimo de cuenca de imagen, debimo que contar grupo no es correcto por
    % la superposicion de celular.
    maxs = imextendedmax(I,  5);
    maxs = imclose(maxs, strel('disk',3));
    maxs = imfill(maxs, 'holes');
    maxs = bwareaopen(maxs, 2);
    overlay2 = imoverlay(I, bw4_perim | maxs, [1 .3 .3]);
    figure
    imshow(overlay2)

    % modificar la imagen para que los píxeles de fondo y los píxeles máximos extendidos se vean obligados a ser los únicos mínimos locales en la imagen.
    Jc = imcomplement(I);
    I_mod = imimposemin(Jc, ~bw4 | maxs);
    figure
    imshow(I_mod)
    %aplicando watershed algorithm:
    L = watershed(I_mod);
    labeledImage = label2rgb(L);
    figure
    imshow(labeledImage)

    %contamos la cantidad de celular
    [L, num] = bwlabel(L);
    %Superpongamos las celdas detectadas sobre la imagen en escala de grises original para evaluar visualmente el rendimiento del algoritmo:
    mask = imbinarize(L, 1);
    overlay3 = imoverlay(I, mask, [1 .3 .3]);
    figure
    imshow(overlay3)
    n=num;
end