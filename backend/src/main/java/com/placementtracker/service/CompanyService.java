package com.placementtracker.service;

import com.placementtracker.dto.CompanyRequest;
import com.placementtracker.dto.CompanyResponse;
import com.placementtracker.entity.Company;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<CompanyResponse> search(String search, String industry, String location, String companySize) {
        return companyRepository.search(blankToNull(search), blankToNull(industry), blankToNull(location), blankToNull(companySize))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CompanyResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .location(request.getLocation())
                .industry(request.getIndustry())
                .companySize(request.getCompanySize())
                .build();
        return toResponse(companyRepository.save(company));
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Company company = findOrThrow(id);
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setIndustry(request.getIndustry());
        company.setCompanySize(request.getCompanySize());
        return toResponse(companyRepository.save(company));
    }

    @Transactional
    public void delete(Long id) {
        Company company = findOrThrow(id);
        companyRepository.delete(company);
    }

    private Company findOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    private CompanyResponse toResponse(Company c) {
        return CompanyResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .website(c.getWebsite())
                .location(c.getLocation())
                .industry(c.getIndustry())
                .companySize(c.getCompanySize())
                .build();
    }
}
