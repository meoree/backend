package ru.iu3.rpo.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.iu3.rpo.backend.models.Country;
import ru.iu3.rpo.backend.repositories.CountryRepository;
import org.springframework.validation.annotation.Validated;


import java.util.List;

@RestController
@RequestMapping("/api/v1")

public class CountryController {

    @Autowired
    CountryRepository countryRepository;

    @PostMapping("/countries")
    public ResponseEntity<Country> createCountry(@Validated @RequestBody Country country)
    {

        Country nc = countryRepository.save(country);
        return new ResponseEntity<Country>(nc, HttpStatus.OK);
    }
    @GetMapping("/countries")
    public List<Country> getAllCountries(){
        return countryRepository.findAll();
    }
}

