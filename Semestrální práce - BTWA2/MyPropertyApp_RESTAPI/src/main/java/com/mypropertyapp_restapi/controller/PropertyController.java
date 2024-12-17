package com.mypropertyapp_restapi.controller;

import com.mypropertyapp_restapi.model.Property;
import com.mypropertyapp_restapi.model.PropertyDto;
import com.mypropertyapp_restapi.model.PropertyHistory;
import com.mypropertyapp_restapi.model.UserDetailsCustom;
import com.mypropertyapp_restapi.service.FileService;
import com.mypropertyapp_restapi.service.PropertyService;
import com.mypropertyapp_restapi.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileService fileService;
    private final UserService userService;

    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getAllProperties(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "sortField", defaultValue = "id") String sortField,
            @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(name = "count", defaultValue = "6") Integer count) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();
        Page<PropertyDto> page = propertyService.PageAll(pageNo, email, sortField, sortDir, count);
        Map<String, Integer> pageRange = propertyService.calculatePageRange(page, pageNo, 3);

        return ResponseEntity.ok(Map.of(
                "startPage", pageRange.get("startPage"),
                "endPage", pageRange.get("endPage"),
                "properties", page.getContent(),
                "totalPages", page.getTotalPages(),
                "currentPage", pageNo
        ));
    }


    @PostMapping("/add")
    public ResponseEntity<Property> addProperty(
            @RequestPart PropertyDto propertyDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "invoice", required = false) MultipartFile invoice) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();
        Property property = propertyService.saveProperty(propertyDto, email, profileImage, images, invoice);
        return ResponseEntity.ok(property);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        PropertyDto property = propertyService.findById(id);
        return ResponseEntity.ok(property);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.removePropertyById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable Long id,
            @RequestPart("propertyDto") PropertyDto propertyDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "invoice", required = false) MultipartFile invoice,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();
        Property updatedProperty = propertyService.updatePropertyById(id, email, propertyDto, profileImage, invoice, images);
        System.out.println(propertyDto);
        System.out.println(updatedProperty);
        return ResponseEntity.ok(updatedProperty);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<Map<String, Object>> getPropertyHistory(
            @PathVariable Long id,
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo) {
        Page<PropertyHistory> page = propertyService.PageAllHistories(pageNo, "all", id, 6);
        Map<String, Integer> pageRange = propertyService.calculatePageRange(page, pageNo, 5);

        return ResponseEntity.ok(Map.of(
                "filteredHistories", page.getContent(),
                "startPage", pageRange.get("startPage"),
                "endPage", pageRange.get("endPage"),
                "totalPages", page.getTotalPages(),
                "currentPage", pageNo
        ));
    }

    @GetMapping("/view/{filename}")
    public void viewFile(
            HttpServletResponse response,
            @PathVariable String filename) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetailsCustom) authentication.getPrincipal()).getUsername();
        Long id = userService.findByEmail(email).getCompany().getId();
        fileService.File(String.valueOf(id), filename, response, "inline; ");
    }


    @DeleteMapping("delete-image/{filename}")
    public ResponseEntity<String> deletePropertyImage(@PathVariable String filename) {
        fileService.deleteFile(filename);
        return ResponseEntity.ok("deleting image " + filename);
    }



}

