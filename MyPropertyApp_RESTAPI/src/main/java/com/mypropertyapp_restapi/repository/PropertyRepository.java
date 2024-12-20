package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    Page<Property> findAllByLocation_Company_Id(Long companyId, Pageable pageable);

}
