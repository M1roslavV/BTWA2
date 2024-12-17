package com.mypropertyapp_restapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String code;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "company_id")
    private Company company;

    private boolean isEnabled;
    @Column(name = "is_account_non_expired")
    private boolean accountNonExpired;
    @Column(name = "is_account_non_locked")
    private boolean accountNonLocked;
    @Column(name = "is_credentials_non_expired")
    private boolean credentialsNonExpired;
}