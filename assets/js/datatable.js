$(document).ready(function () {
    function initializeDataTable(table) {
        const $table = $(table);
        const $tbody = $table.find('tbody');
        const $rows = $tbody.find('tr');
        const $searchContainer = $table.closest('.card').find('[data-search-container]');
        const $entriesContainer = $table.closest('.card').find('[data-entries-container]');
        const $paginationContainer = $table.closest('.card').find('[data-pagination-container]');

        // Table attributes
        const enableSearch = $table.data('search') === true;
        const enablePerPage = $table.data('per-page') === true;
        const defaultEntries = parseInt($table.data('entries')) || 5;

        let currentPage = 1;
        let perPage = defaultEntries;
        let filteredRows = $rows;

        // Initialize Visibility
        if (!enableSearch) $searchContainer.hide();
        if (!enablePerPage) $entriesContainer.hide();

        // Paginate rows
        function paginate(page) {
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;

            // Hide all rows and show the filtered rows in the range
            filteredRows.hide();
            const visibleRows = filteredRows.slice(startIndex, endIndex);
            visibleRows.show();

            // Check if no rows are visible
            if (visibleRows.length === 0 && filteredRows.length > 0) {
                // Add a "No results found" row only if it's not already added
                if ($tbody.find('.no-results-row').length === 0) {
                    const noResultsRow = `
                        <tr class="no-results-row">
                            <td colspan="${$table.find('thead th').length}" class="text-center">No results found</td>
                        </tr>
                    `;
                    $tbody.append(noResultsRow);
                }
            } else {
                // Remove the "No results found" row if it exists
                $tbody.find('.no-results-row').remove();
            }

            updatePagination(page);
        }

        // Update pagination
        function updatePagination(page) {
            const totalRows = filteredRows.length;
            const totalPages = Math.ceil(totalRows / perPage);

            let paginationHtml = `
                <ul class="pagination pagination-sm m-0">
                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${page - 1}">
                            <i class="ri-arrow-left-double-fill"></i>
                        </a>
                    </li>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `
                    <li class="page-item ${page === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            }

            paginationHtml += `
                    <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${page + 1}">
                            <i class="ri-arrow-right-double-line"></i>
                        </a>
                    </li>
                </ul>
            `;

            $paginationContainer.html(paginationHtml);
        }

        // Handle pagination clicks
        $paginationContainer.on('click', '.page-link', function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page)) {
                currentPage = page;
                paginate(currentPage);
            }
        });

        // Handle entries per page change
        $entriesContainer.find('select').on('change', function () {
            perPage = parseInt($(this).val());
            currentPage = 1;
            paginate(currentPage);
        });

        // Handle live search
        $searchContainer.find('input').on('keyup', function () {
            const query = $(this).val().toLowerCase();
            if (query) {
                filteredRows = $rows.filter(function () {
                    return $(this).text().toLowerCase().includes(query);
                });
            } else {
                filteredRows = $rows; // Reset to all rows if query is empty
            }
            currentPage = 1; // Reset to first page
            paginate(currentPage);
        });

        // Initialize table with default values
        paginate(currentPage);
    }

    // Apply to all tables with data attributes
    $('#table1').each(function () {
        initializeDataTable(this);
    });
});


