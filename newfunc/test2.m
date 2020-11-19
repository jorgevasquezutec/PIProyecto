function n = test2(ruta)
    imagen = imread(ruta);
    figure
    imshow(imagen)
    title('Imagen Ingresada')
    
    %convertimos blanco y negro
    gray_image = rgb2gray(imagen);
    %ajuste de contraste
    I2 = adapthisteq(gray_image);
    %convertir la imagen en binaria
    BW = imbinarize(I2,graythresh(I2));
    BW1= bwareaopen(BW,1000);
    BW2=~BW1;
    BW3 = imfill(BW2,'holes');
    BW4= bwareaopen(BW3,400);
    se = strel('disk',5);
    image1=imerode(BW4,se);
    imshow(image1)
    title('Imagen Ingresada2')

    stats = regionprops('table',image1,'Area');
    %disp(stats);
    orderstats=sortrows(stats,'Area', 'descend');
    disp(orderstats)

    segmentedRBC = bwareafilt(image1,[0 499]);
    segmentedRBC = imfill(segmentedRBC,'holes');
    se=strel('disk',7);
    segmentedRBC=imerode(segmentedRBC,se);
    imshow(segmentedRBC)
    title('Imagen segmentedRBC')

    f = bwconncomp(segmentedRBC);
    RBC_counter = f.NumObjects;
    fprintf('%s %d\n','Cantidad de RBC = ',RBC_counter);




