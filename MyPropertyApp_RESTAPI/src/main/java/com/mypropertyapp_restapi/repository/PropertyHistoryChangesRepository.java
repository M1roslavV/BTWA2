package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.PropertyHistoryChanges;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyHistoryChangesRepository extends JpaRepository<PropertyHistoryChanges, Long> {

}

