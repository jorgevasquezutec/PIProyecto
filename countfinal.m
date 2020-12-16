function n=countfinal(ruta)
    imagen=imread(ruta);
    figure
    imshow(imagen)
    title('Imagen Original')
    hsvi=rgb2hsv(imagen);
    Mask = (hsvi(:,:,3)>0.068);
    figure
    imshow(Mask);
    title('Capa 3 de hsv imagen')
    gray_image = rgb2gray(imagen);
    figure
    imshow(gray_image);
    imbaniza=imbinarize(gray_image);
    figure
    imshow(imbaniza);
    
    
    J = imerode(Mask,strel('disk',14));
    figure
    imshow(J);
    M=J;
    
    J = imdilate(J,strel('disk',13));
    figure
    imshow(J);
    title('figura 13')
    
    
    J = ~J;
    figure
    imshow(J);
    J= imclearborder(J);
    figure
    imshow(J);
    [labeledImage, manchas_counter] = bwlabel(J);
    disp("Manchas")
    disp(manchas_counter);
    
    
    
    
    figure,imshow(gray_image)
    title('Imagen en escala de grises')
    gray_image = imadjust(gray_image,[0.3 0.7],[]);
    
    bin = imbinarize(gray_image);
    bin = imclearborder(bin);
    bin = bwareaopen(bin, 10);
    [labeledImage0, WBC_counter] = bwlabel(bin);
    m = regionprops(labeledImage0);
    figure,imshow(labeledImage0)
    title('bin')
    
    
    
    
    [~, threshold] = edge(gray_image, 'canny');
    cc = 1.5;
    imagen_bordeada = edge(gray_image,'canny', threshold*cc);
    imagen_bordeada1= imclearborder(imagen_bordeada);
    
    
    % Filling the holes of above processed image
    imagen_sin_agujeros = imfill(imagen_bordeada1,'holes');
    imagen_sin_agujeros = bwareaopen(imagen_sin_agujeros, 20);
    figure
    imshow(imagen_sin_agujeros)
    title('imagen_sin_agujeros')
    [labeledImage2, numbercircles2] = bwlabel(imagen_sin_agujeros);
    
    
    stats = regionprops('table',imagen_sin_agujeros,'Area');
    stats = sortrows(stats,'Area');
    evaluateStat=unique(stats);
    %disp(size(stats))
    
    
    extractCircle = bwpropfilt(imagen_sin_agujeros,'Area',[100 2799]);
    figure
    imshow(extractCircle);
    title('RBC Extraídas')
    
    
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
    % WBC_counter = fix(WBC_counter);
    %{
    for row = 1:size(A,1)
        for col = 1:size(A,2)
            suma = suma + A(row, col);
        end
    end
    %}
    
        % Contar el numero de circulos
    f = bwconncomp(extractCircle, 8);
    Total_counter = f.NumObjects;
    
    disp("Total Celulas")
    disp(Total_counter)
    
    %disp("Total Celulas 2")
    %disp(Total_counter2)
    
    disp('Glóbulos blancos')
    disp(WBC_counter);
    
    RBC_counter = Total_counter-manchas_counter-WBC_counter;
    disp("Globulos rojos")
    disp(RBC_counter)
    
    if (WBC_counter > RBC_counter)
        disp("Positivo para leucemia");
    else
        disp("Negativo para leucemia");
    end
end
