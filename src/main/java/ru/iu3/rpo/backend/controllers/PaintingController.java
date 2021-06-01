package ru.iu3.rpo.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.iu3.rpo.backend.models.Painting;
import ru.iu3.rpo.backend.repositories.PaintingRepository;

import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PaintingController {
    @Autowired
    PaintingRepository paintingRepository;

    @GetMapping("/paintings")
    public List<Painting> getAllMuseums() {
        return paintingRepository.findAll();
    }

    @PostMapping("/paintings")
    public ResponseEntity<?> createPainting(@Validated @RequestBody Painting painting) {
        try {
            Painting nm = paintingRepository.save(painting);
            return new ResponseEntity<Painting>(nm, HttpStatus.OK);
        }
        catch (Exception ex) {
            String error;
            if (ex.getMessage().contains("museums.name_UNIQUE"))
                error = "paintingalreadyexists";
            else
                error = "undefinederror";
            Map<String, String> map = new HashMap<>();
            map.put("error", error);
            return new ResponseEntity<Object>(map, HttpStatus.OK);
        }
    }

    @PutMapping("/paintings/{id}")
    public ResponseEntity<Painting> updatePainting(@PathVariable(value = "id") Long paintingsID,
                                               @Validated @RequestBody Painting paintingDetails) {
       Painting painting = null;
        Optional<Painting> cc = paintingRepository.findById(paintingsID);
        if (cc.isPresent()) {
            painting = cc.get();
            painting.name = paintingDetails.name;
            painting.year = paintingDetails.year;
            paintingRepository.save(painting);
        } else
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "painting not found"
            );
        return ResponseEntity.ok(painting);
    }

    @DeleteMapping("/paintings/{id}")
    public Map<String, Boolean> deletePainting(@PathVariable(value = "id") Long museumId) {
        Optional<Painting> painting = paintingRepository.findById(museumId);
        Map<String, Boolean> response = new HashMap<>();
        if (painting.isPresent()) {
            paintingRepository.delete(painting.get());
            response.put("deleted", Boolean.TRUE);
        }
        else
            response.put("deleted", Boolean.FALSE);
        return response;
    }
}