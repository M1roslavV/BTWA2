package com.mypropertyapp_restapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PropertyDto {
    private Long id;
    private String inventoryNumber;
    private String name;
    private String responsiblePeople;
    private double price;
    private String category;
    private String location;
    private String profileImageUrl;
    private String invoices;
    private List<String> imageUrls;
}
