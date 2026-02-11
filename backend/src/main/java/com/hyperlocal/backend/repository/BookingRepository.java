package com.hyperlocal.backend.repository;

import com.hyperlocal.backend.model.Booking;
import com.hyperlocal.backend.model.Provider;
import com.hyperlocal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByProvider(Provider provider);
    List<Booking> findByUser(User user);
}
