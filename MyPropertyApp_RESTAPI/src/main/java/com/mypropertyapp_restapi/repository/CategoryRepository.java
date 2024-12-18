package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByPropertiesLocationCompanyId(Long companyId);
    Category findByName(String name);

}
