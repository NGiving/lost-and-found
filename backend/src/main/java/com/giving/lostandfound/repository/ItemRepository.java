package com.giving.lostandfound.repository;

import com.giving.lostandfound.enums.ItemStatus;
import com.giving.lostandfound.model.Item;
import com.giving.lostandfound.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item>, PagingAndSortingRepository<Item, Long> {
    List<Item> findByStatus(ItemStatus status);

    List<Item> findByFilledBy(User user);

    List<Item> findByClaimedBy(User user);

    List<Item> findByNameContainingIgnoreCase(String name);

    List<Item> findByLocationContainingIgnoreCase(String location);

    List<Item> findByDateReportedAfter(LocalDateTime date);

    List<Item> findByDateReportedBefore(LocalDate date);

    List<Item> findByClaimedByIsNotNull();

    List<Item> findByClaimedByIsNull();

    @Query(value = "SELECT * FROM items WHERE to_tsvector('english', description) @@ websearch_to_tsquery('english', :description)", nativeQuery = true)
    List<Item> findByDescriptionFts(@Param("description") String description);
}
