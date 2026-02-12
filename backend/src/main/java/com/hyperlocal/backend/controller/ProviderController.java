package com.hyperlocal.backend.controller;

import com.hyperlocal.backend.model.Provider;
import com.hyperlocal.backend.repository.ProviderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*") // allow frontend access
public class ProviderController {

    private final ProviderRepository providerRepository;

    public ProviderController(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    // Add provider
    @PostMapping
    public Provider createProvider(@RequestBody Provider provider) {
        return providerRepository.save(provider);
    }

    // Get all providers
    @GetMapping
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    // Get provider by id
    @GetMapping("/{id}")
    public Provider getProviderById(@PathVariable Long id) {
        return providerRepository.findById(id).orElse(null);
    }

    // Delete provider
    @DeleteMapping("/{id}")
    public void deleteProvider(@PathVariable Long id) {
        providerRepository.deleteById(id);
    }
}
