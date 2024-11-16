const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const exportToCSV = (data, filters = {}) => {
  // Create filtered data
  let exportData = [...data]
    .filter(item => {
      if (filters.status && item['Status (Vessel)'] !== filters.status) return false;
      if (filters.criticality && item.Criticality !== filters.criticality) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .map((item, index) => ({
      'S.No': index + 1,
      'Status': item['Status (Vessel)'],
      'Criticality': item.Criticality || '',
      'Equipment': item.Equipments,
      'Description': item.Description,
      'Date Reported': formatDate(item['Date Reported']),
      'Date Completed': formatDate(item['Date Completed'])
    }));

  // Convert to CSV
  const headers = Object.keys(exportData[0]);
  const csvRows = [
    headers.join(','),
    ...exportData.map(row => 
      headers.map(header => {
        let cell = row[header] || '';
        // Escape commas and quotes
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `defects-report-${formatDate(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
