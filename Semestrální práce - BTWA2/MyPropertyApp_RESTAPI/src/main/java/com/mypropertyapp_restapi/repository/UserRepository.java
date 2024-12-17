package com.mypropertyapp_restapi.repository;

import com.mypropertyapp_restapi.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);
    User findById(Long id);

    Page<User> findByCompany_Id(Long companyId, Pageable pageable);
}
