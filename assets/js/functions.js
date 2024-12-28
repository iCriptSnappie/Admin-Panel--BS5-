$(document).ready(function () {
    function initializeDataTable(table) {
        const $table = $(table);
        const $rows = $table.find('tbody tr');
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

            // Show only rows within the range
            filteredRows.hide();
            filteredRows.slice(startIndex, endIndex).show();

            updatePagination(page);
        }

        // Update pagination
        function updatePagination(page) {
            const totalRows = filteredRows.length;
            const totalPages = Math.ceil(totalRows / perPage);

            let paginationHtml = `
                <ul class="pagination pagination-sm">
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
    $('table').each(function () {
        initializeDataTable(this);
    });
});
