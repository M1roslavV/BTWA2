package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.File;
import com.mypropertyapp_restapi.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    File findByName(String fileName);

    List<File> findByPropertyIdAndFileTypeName(Long id, String type);
    List<File> findByActionAndPropertyIdAndFileTypeName(String action, Long id, String type);

    List<File> findByProperty(Property property);

    List<File> findAllByPropertyAndFileType_Name(Property property, String fileType);
}

