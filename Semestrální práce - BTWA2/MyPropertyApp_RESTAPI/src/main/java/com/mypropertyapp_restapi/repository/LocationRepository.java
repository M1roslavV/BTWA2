package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.Company;
import com.mypropertyapp_restapi.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByCompanyId(Long companyId);
    Location findByNameAndCompany(String name, Company company);
}
