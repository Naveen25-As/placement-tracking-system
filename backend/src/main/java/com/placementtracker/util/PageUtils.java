package com.placementtracker.util;

import com.placementtracker.dto.PageResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

public final class PageUtils {

    private PageUtils() {}

    public static <T, R> PageResponse<R> toPageResponse(Page<T> page, Function<T, R> mapper) {
        List<R> content = page.getContent().stream().map(mapper).toList();
        return PageResponse.<R>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
