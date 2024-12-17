package com.mypropertyapp_restapi.service;

import com.mypropertyapp_restapi.model.*;
import com.mypropertyapp_restapi.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private  final CategoryRepository categoryRepository;
    private final FileService fileService;
    private final PropertyHistoryChangesRepository typeChangesRepository;
    private final PropertyHistoryRepository propertyHistoryRepository;
    private final FileRepository fileRepository;

    public Page<PropertyDto> PageAll(Integer pageNo, String email, String sortField, String sortDir, Integer size) {
        Company company = userRepository.findByEmail(email).getCompany();
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortField);
        PageRequest pageable = PageRequest.of(pageNo - 1, size, sort);

        Page<Property> properties = propertyRepository.findAllByLocation_Company_Id(company.getId(), pageable);

        return properties.map(property -> {
            PropertyDto propertyDto = new PropertyDto();
            propertyDto.setId(property.getId());
            propertyDto.setInventoryNumber(property.getInventoryNumber());
            propertyDto.setResponsiblePeople(property.getResponsiblePeople());
            propertyDto.setPrice(property.getPrice());
            propertyDto.setName(property.getName());
            propertyDto.setLocation(property.getLocation().getName());
            propertyDto.setCategory(property.getCategory().getName());

            List<File> profilePictures = fileService.findByPropertyIdAndTypeName(property.getId(), "profilProperty");
            if (!profilePictures.isEmpty()) {
                propertyDto.setProfileImageUrl(profilePictures.get(0).getName());
            }

            List<File> otherImages = fileService.findByPropertyIdAndTypeName(property.getId(), "imagesProperty");
            propertyDto.setImageUrls(otherImages.stream().map(File::getName).toList());

            return propertyDto;
        });
    }


    public Page<PropertyHistory> PageAllHistories(Integer pageNo, String filter, Long id, Integer size){
        PageRequest pageable = PageRequest.of(pageNo -1, size);
        if (Objects.equals(filter, "all"))
            return propertyHistoryRepository.findByPropertyId(id, pageable);
        else
            return propertyHistoryRepository.findByPropertyHistoryChanges_NameAndPropertyId(filter, id, pageable);
    }

    public Property saveProperty(PropertyDto propertyDto, String email, MultipartFile profileImage, List<MultipartFile> images, MultipartFile invoice) throws IOException {
        Company company = userRepository.findByEmail(email).getCompany();
        String[] changedFrom = new String[6];

        Location location = locationRepository.findByNameAndCompany(propertyDto.getLocation(), company);
        if(location==null){
            location = new Location();
            location.setName(propertyDto.getLocation());
            location.setCompany(company);
            locationRepository.save(location);
        }

        Category category = categoryRepository.findByName(propertyDto.getCategory());
        if(category == null){
            category = new Category();
            category.setName(propertyDto.getCategory());
            categoryRepository.save(category);
        }

        Property property;
        if (propertyDto.getId() != null) {
            property = propertyRepository.findById(propertyDto.getId()).orElse(new Property());
            changedFrom[0] = property.getInventoryNumber();
            changedFrom[1] = property.getName();
            changedFrom[2] = property.getCategory().getName();
            changedFrom[3] = property.getLocation().getName();
            changedFrom[4] = property.getPrice() + "";
            changedFrom[5] = property.getResponsiblePeople();

        } else {
            property = new Property();
        }

        String[] change = new String[6];

        property.setInventoryNumber(propertyDto.getInventoryNumber());
        change[0] = propertyDto.getInventoryNumber();
        property.setName(propertyDto.getName());
        change[1] = propertyDto.getName();
        property.setCategory(categoryRepository.findByName(propertyDto.getCategory()));
        change[2] = categoryRepository.findByName(propertyDto.getCategory()).getName();
        property.setLocation(locationRepository.findByNameAndCompany(propertyDto.getLocation(), company));
        change[3] = locationRepository.findByNameAndCompany(propertyDto.getLocation(), company).getName();
        property.setPrice(propertyDto.getPrice());
        change[4] = propertyDto.getPrice() + "";
        if(Objects.equals(propertyDto.getResponsiblePeople(), "") || propertyDto.getResponsiblePeople() == null) {
            String responsibleUser = userRepository.findByEmail(email).getFirstName() + " " + userRepository.findByEmail(email).getLastName();
            property.setResponsiblePeople(responsibleUser);
            change[5] = responsibleUser;
        }
        else{
            property.setResponsiblePeople(propertyDto.getResponsiblePeople());
            change[5] = propertyDto.getResponsiblePeople();
        }
        propertyRepository.save(property);

        if (profileImage != null) {
            fileService.deleteFilesIfExist(property, "profilProperty");
            fileService.saveFile(company.getId(), profileImage, property, "profilProperty", email, 7L, null); // Typ obrázku: "Profile Image"
        }

        if (images != null && !images.isEmpty()) {
            fileService.deleteFilesIfExist(property, "imagesProperty");
            for (MultipartFile file : images) {
                fileService.saveFile(company.getId(), file, property, "imagesProperty", email, 8L, null); // Typ obrázku: "Property Image"
            }
        }

        if (invoice != null) {
            fileService.deleteFilesIfExist(property, "invoicesProperty");
            fileService.saveFile(company.getId(), invoice, property, "invoicesProperty", email, 7L, null); // Typ obrázku: "Profile Image"
        }


        for (int i = 0;i<=5;i++){
            if(!Objects.equals(change[i], changedFrom[i]) && propertyDto.getId() != null){
                PropertyHistory propertyHistory = new PropertyHistory();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss dd.MM.yyyy");
                LocalDateTime now = LocalDateTime.now();
                String date = now.format(formatter);
                propertyHistory.setDateTime(date);
                propertyHistory.setChanger(userRepository.findByEmail(email).getFirstName() + " " + userRepository.findByEmail(email).getLastName());
                propertyHistory.setPropertyHistoryChanges(typeChangesRepository.findById((long) (i+1)).get());
                propertyHistory.setProperty(property);
                propertyHistory.setChangedFrom(changedFrom[i]);
                propertyHistory.setChangedTo(change[i]);
                propertyHistoryRepository.save(propertyHistory);
            }
        }
        return property;
    }

    public Map<String, Integer> calculatePageRange(Page<?> page, int pageNo, int maxLinks) {
        Map<String, Integer> pageRange = new HashMap<>();

        if (page.getTotalPages() > 0) {
            int startPage = Math.max(1, pageNo - maxLinks / 2);
            int endPage = Math.min(startPage + maxLinks - 1, page.getTotalPages());

            if (endPage - startPage < maxLinks - 1) {
                startPage = Math.max(1, endPage - maxLinks + 1);
            }

            pageRange.put("startPage", startPage);
            pageRange.put("endPage", endPage);
        } else {
            pageRange.put("startPage", 0);
            pageRange.put("endPage", 0);
        }

        return pageRange;
    }

    public List<Category> categories(Principal principal){
        return categoryRepository.findByPropertiesLocationCompanyId(userRepository.findByEmail(principal.getName()).getCompany().getId()).stream().distinct().collect(Collectors.toList());
    }

    public List<Location> locations(Principal principal){
        return locationRepository.findByCompanyId(userRepository.findByEmail(principal.getName()).getCompany().getId()).stream().distinct().collect(Collectors.toList());
    }

    public void removePropertyById(Long id) {
        Optional<Property> propertyOptional = propertyRepository.findById(id);
        if (propertyOptional.isPresent()) {
            Property property = propertyOptional.get();
            for (File file : property.getFiles()) {
                file.setProperty(null);
                fileRepository.save(file);
            }
            propertyHistoryRepository.deleteAll(property.getPropertyHistories());
            propertyRepository.delete(property);
        }
    }


    public Property updatePropertyById(Long id,String email, PropertyDto propertyDto, MultipartFile profileImage,
                                          MultipartFile invoice, List<MultipartFile> images) throws IOException {
        return saveProperty(propertyDto,email, profileImage, images, invoice);
    }


    public PropertyDto findById(Long id){
        Property property = propertyRepository.findById(id).get();
        PropertyDto propertyDto = new PropertyDto();
        propertyDto.setId(property.getId());
        propertyDto.setInventoryNumber(property.getInventoryNumber());
        propertyDto.setName(property.getName());
        propertyDto.setPrice(property.getPrice());
        propertyDto.setResponsiblePeople(property.getResponsiblePeople());
        propertyDto.setCategory(property.getCategory().getName());
        propertyDto.setLocation(property.getLocation().getName());
        List<File> profileImages = fileService.findByPropertyIdAndTypeName(property.getId(), "profilProperty");
        if (!profileImages.isEmpty()) {
            String profileImg = profileImages.get(0).getName();
            propertyDto.setProfileImageUrl(profileImg);
        }
        List<File> invoices = fileService.findByPropertyIdAndTypeName(property.getId(), "invoicesProperty");
        if (!invoices.isEmpty()) {
            String invoice = invoices.get(0).getName();
            propertyDto.setInvoices(invoice);
        }
        List<File> images = fileService.findByPropertyIdAndTypeName(property.getId(), "imagesProperty");
        if (!images.isEmpty()) {
            List<String> imageNames = images.stream().map(File::getName).toList();
            propertyDto.setImageUrls(imageNames);
        }


        return propertyDto;
    }
    public List<PropertyHistoryChanges> allTypesChanges(){return typeChangesRepository.findAll();}
}


