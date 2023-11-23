const searchInputs = document.querySelectorAll("input[data-column]");

searchInputs.forEach((input) => {
  input.addEventListener("input", function () {
    const rows = document.querySelectorAll(".table-data tbody tr");
    const filters = Array.from(searchInputs)
      .map((input) => ({
        columnIndex: input.dataset.column,
        searchQuery: input.value.toLowerCase(),
      }))
      .filter((filter) => filter.searchQuery !== "");

    rows.forEach((row) => {
      const match = filters.every((filter) => {
        const text = row.cells[filter.columnIndex].textContent.toLowerCase();
        return text.includes(filter.searchQuery);
      });

      row.style.display = match ? "" : "none";
    });
  });
});
