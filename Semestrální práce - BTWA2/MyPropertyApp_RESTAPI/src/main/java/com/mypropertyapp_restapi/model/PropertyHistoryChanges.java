package com.mypropertyapp_restapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "type_changes")
public class PropertyHistoryChanges {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @OneToMany(mappedBy = "propertyHistoryChanges", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PropertyHistory> propertyHistories;
}

