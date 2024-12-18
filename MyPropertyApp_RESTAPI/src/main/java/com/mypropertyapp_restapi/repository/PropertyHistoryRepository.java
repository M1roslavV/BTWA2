package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.PropertyHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyHistoryRepository extends JpaRepository<PropertyHistory, Long> {
    Page<PropertyHistory> findByPropertyHistoryChanges_NameAndPropertyId(String filter, Long id, Pageable pageable);

    Page<PropertyHistory> findByPropertyId(Long id, Pageable pageable);
}

