.container {
  min-height: 100vh;
  background: #F9F7F4;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.header h1 {
  margin: 0;
  color: #2D2D2B;
}

.logoutBtn {
  padding: 8px 16px;
  background: #E8B4C8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.authContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #E8B4C8;
}

.authBox {
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.authInput {
  width: 100%;
  padding: 12px;
  border: 1px solid #E8E8E5;
  border-radius: 6px;
  margin-bottom: 16px;
}

.authBtn {
  width: 100%;
  padding: 12px;
  background: #E8B4C8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.kpiGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.kpiCard {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #E8B4C8;
}

.kpiValue {
  font-size: 28px;
  font-weight: 700;
  color: #2D2D2B;
}

.kpiLabel {
  font-size: 12px;
  color: #A0A09E;
  margin-top: 8px;
}

.filterBox {
  background: white;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filterInput {
  padding: 10px;
  border: 1px solid #E8E8E5;
  border-radius: 6px;
  flex: 1;
}

.resetBtn {
  padding: 10px 16px;
  background: #F0F0ED;
  border: 1px solid #E8E8E5;
  border-radius: 6px;
  cursor: pointer;
}

.tableContainer {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: #F9F7F4;
  border-bottom: 2px solid #E8E8E5;
}

.table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #2D2D2B;
}

.table td {
  padding: 14px 16px;
  border-bottom: 1px solid #E8E8E5;
  color: #2D2D2B;
}
