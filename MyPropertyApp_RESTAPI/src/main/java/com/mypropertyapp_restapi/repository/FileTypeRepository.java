package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.FileType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileTypeRepository extends JpaRepository<FileType, Long> {
    FileType findByName(String name);
}

