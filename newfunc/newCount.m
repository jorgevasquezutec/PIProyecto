function n = nuevo(ruta)
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
    evaluateStat=unique(stats);
   
    A=table2array(evaluateStat)    
    lower=0;
    max=0;
    max_distance=0;
    save_lower_value=0;
    M = mean(A);
    %save_median=M;
    for n = 1 : length(A)
        lower=max;
        max=A(n);
        if (max-lower>max_distance)
            max_distance=max-lower;
            save_lower_value=lower;
            %save_median=max-M;
        end   
    end
    disp(save_lower_value);
    save_lower_value=save_lower_value-1;

    extractCircle = bwpropfilt(imagen_sin_agujeros,'Area',[0 save_lower_value]);
    figure
    imshow(extractCircle)
    title('RBC Extraídas')
    
    % Contar el numero de circulos
    f = bwconncomp(extractCircle, 8);
    RBC_counter = f.NumObjects;
    fprintf('%s %d\n','Cantidad de RBC = ',RBC_counter);
    
    
    t = bwconncomp(imagen_sin_agujeros,8);
    ALLcell = t.NumObjects;
    fprintf('%s %d\n','Cantidad de celulas = ',ALLcell);
    fprintf('%s %d\n','Cantidad de WBC = ',ALLcell-RBC_counter);
    procent = (ALLcell-RBC_counter)*100/ALLcell;
    fprintf('Percent WBC: %0.8f %%',procent);
    
    