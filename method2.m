% function n =method1(imagen)
    % imagen=imread(imagen);
    imagen=imread('fotos/cells.jpg');
    % figure
    % imshow(imagen)
    % title('Imagen Original')
    hsvi=rgb2hsv(imagen);
    Mask = (hsvi(:,:,3)>0.068);
    % figure
    % imshow(Mask);
    % title('Capa 3 de hsv imagen')
    gray_image = rgb2gray(imagen);
    % figure
    % imshow(gray_image);
    % title('Imagenblanconegro')


    %erosionar la capa 3 hsv
    J = imerode(Mask,strel('disk',14));
    M=J;
    % figure
    % imshow(J);
    % title('M erosionado')

    %dilatar la capa 3 hsv
    J = imdilate(J,strel('disk',13));
    % figure
    % imshow(J);
    % title('J dilatado')


    %negamos la imagen.
    J = ~J;
    % figure
    % imshow(J);
    % nextraemos el borde.
    J= imclearborder(J);
    % figure
    % imshow(J);
    %contamos las manchas.
    [labeledImage0, manchas] = bwlabel(J);
    % disp("Manchas")
    % disp(numbercircles);


    %intesificar la imagen y sobresaltar los colores blancos y negros.
    gray_image = imadjust(gray_image,[0.3 0.7],[]);
    % figure,imshow(gray_image)
    % title('Intesificar colores imagen')
    %binarizas la imagen
    bin = imbinarize(gray_image);
    %borra todo lo negro y se queda solo con lo blanco
    bin = imclearborder(bin);
    %elimina los hueco blanco que tienen menor de 10 pixeles.
    bin = bwareaopen(bin, 10);
    %te devuelde componentes conectado por default 8 objetos.
    [labeledImage1, globulosblancos] = bwlabel(bin);
    % m = regionprops(labeledImage0);
    % figure,imshow(labeledImage0)
    % title('bin')
    % disp('Globulos blancos')
    % disp(numbercircles0)




    %En la imagen intesifica buscamos los bordes.
    %Las figuras pegadas a los bordes de la imagen no las cuentas
    %extrae el umbral de los bordes de las figuras.
    [~, threshold] = edge(gray_image, 'canny');
    cc = 1.5;
    %te la la imagen bordeada.
    imagen_bordeada = edge(gray_image,'canny', threshold*cc);
    %borramos todo lo negro.
    imagen_bordeada1= imclearborder(imagen_bordeada);

    % rellenamos los edges cerrados.
    imagen_sin_agujeros = imfill(imagen_bordeada1,'holes');
    % extraemos los mayores a 20 pixeles.
    imagen_sin_agujeros = bwareaopen(imagen_sin_agujeros, 20);
    % figure
    % imshow(imagen_sin_agujeros)
    % title('imagen_sin_agujeros')
    % [labeledImage2, numbercircles2] = bwlabel(imagen_sin_agujeros);

    %Extraemos todas las areas de las figuras
    stats = regionprops('table',imagen_sin_agujeros,'Area');
    stats = sortrows(stats,'Area');
    A=table2array(stats);
    % disp(A);
    %planteamos que el 23% de lo extraido es basura,debido a que A esta ordenado suponesmo que las menores
    %areas son basuras, esto se podria arreglar con machine leerning.
    mfloor=A( floor(length(A)*0.23));

    %filtramos solo por el area
    extractCircle = bwpropfilt(imagen_sin_agujeros,'Area',[mfloor max(A)]);
    % figure
    % imshow(extractCircle);
    % title('RBC Extraídas')


    newfinal=M.*extractCircle;
    figure
    imshow(newfinal);
    title('sin manchas')
    
    stats = regionprops('table',logical(newfinal),'Centroid',...
    'MajorAxisLength','MinorAxisLength');
    
    
    stats3 = stats{1:size(stats),{'MajorAxisLength'}} - stats{1:size(stats),{'MinorAxisLength'}};
    stats3 = mean(stats3);
    Total_counter2 = 0;
    for i=1:size(stats)
            resta = stats{i,{'MajorAxisLength'}} - stats{i,{'MinorAxisLength'}};
            if resta < stats3
                Total_counter2 = Total_counter2 + 1;
            else
                Total_counter2 = Total_counter2 + floor((stats{i,{'MajorAxisLength'}} - stats{i,{'MinorAxisLength'}}) / stats3);
            end
    end





    % Contar el numero de circulos
    f = bwconncomp(extractCircle, 8);
    totalCelulas = f.NumObjects;
    globulosRojos=totalCelulas-globulosblancos-manchas;
    n=[totalCelulas globulosRojos globulosblancos manchas];

% end




