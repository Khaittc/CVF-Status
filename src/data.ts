import { AppState, ProjectMetadata, SpecDomain, UIModule, Decision, RoadmapPhase } from './types';

const metadata: ProjectMetadata = {
  trackedProject: 'TTC Project Material Manager',
  projectSubtitle: 'Project Materials, Inventory & Supplier Management',
  trackerVersion: '0.1.0',
  statusDate: '2026-08-28',
  currentPhase: 'Phase 2 — AI Studio Product Prototype',
  currentFocus: 'Review and freeze CVF UI Prototype V0, then create the first interactive prototype.',
  productionAuthority: 'NOT_AUTHORIZED',
  prototypePromotionDefault: 'PARTIAL_REUSE'
};

const specs: SpecDomain[] = [
  { id: 'SPEC-001', domain: 'Product Intent', status: 'CONFIRMED', summary: 'Ứng dụng nội bộ quản lý vật tư, Supplier Price, Project, BOM và Warehouse cho công ty dịch vụ kỹ thuật', nextAction: 'Giữ làm product baseline' },
  { id: 'SPEC-002', domain: 'Authorization / RBAC', status: 'FROZEN_FOR_V1', summary: 'Dynamic Role, multi-role user, allow-only, default deny, protected Admin, UI visibility theo Role', nextAction: 'Prototype Role & Permission' },
  { id: 'SPEC-003', domain: 'Material Identity', status: 'FROZEN_FOR_V1', summary: 'Manufacturer + Manufacturer Model là identity; unique trong cùng Manufacturer', nextAction: 'Prototype validation' },
  { id: 'SPEC-004', domain: 'Material Lifecycle', status: 'FROZEN_FOR_V1', summary: 'Active, Archived, conditional hard delete; không lưu change history', nextAction: 'Prototype archive/delete UX' },
  { id: 'SPEC-005', domain: 'Material Category', status: 'FROZEN_FOR_V1', summary: 'Category phân cấp, configurable, một Material một Category', nextAction: 'Prototype tree' },
  { id: 'SPEC-006', domain: 'Unit of Measure', status: 'FROZEN_FOR_V1', summary: 'Một UOM cố định; UOM code unique; locked sau khi Material được dùng', nextAction: 'Prototype form behavior' },
  { id: 'SPEC-007', domain: 'Manufacturer Master', status: 'FROZEN_FOR_V1', summary: 'Manufacturer Code unique; Name có thể trùng; conditional delete', nextAction: 'Prototype CRUD' },
  { id: 'SPEC-008', domain: 'Customer Master', status: 'FROZEN_FOR_V1', summary: 'Customer Code unique; Customer có nhiều Project; delete blocked khi referenced', nextAction: 'Prototype CRUD' },
  { id: 'SPEC-009', domain: 'Project Master', status: 'BASELINE_CONFIRMED', summary: 'Project Code unique; Customer từ searchable dropdown', nextAction: 'Review Project lifecycle' },
  { id: 'SPEC-010', domain: 'Supplier Master', status: 'FROZEN_CORE', summary: 'Tax Code unique; Name/Address có thể trùng; conditional delete', nextAction: 'Prototype CRUD' },
  { id: 'SPEC-011', domain: 'Supplier Material Price', status: 'FROZEN_FOR_V1', summary: 'Một Current Price cho Material + Supplier; VND; chưa VAT; không quantity tier', nextAction: 'Prototype price tables' },
  { id: 'SPEC-012', domain: 'Rolling Price Snapshot', status: 'FROZEN_FOR_V1', summary: 'Chỉ giữ Previous và Current Price kèm thời gian', nextAction: 'Prototype price change UI' },
  { id: 'SPEC-013', domain: 'Preferred Supplier', status: 'FROZEN_FOR_V1', summary: '0..1 Preferred Supplier cho một Material; đổi phải confirm', nextAction: 'Prototype confirmation' },
  { id: 'SPEC-014', domain: 'Supplier Recommendation', status: 'FROZEN_CORE', summary: 'Cheapest, Preferred và Final Supplier là ba khái niệm độc lập', nextAction: 'Prototype BOM table' },
  { id: 'SPEC-015', domain: 'BOM', status: 'PARTIAL', summary: 'BOM line có quantity, Supplier recommendation và Final Supplier', nextAction: 'Review lifecycle sau prototype' },
  { id: 'SPEC-016', domain: 'Goods Receiving', status: 'FROZEN_CORE', summary: 'Partial receiving; nhận một lần rồi phân bổ Project + Warehouse', nextAction: 'Prototype receiving modal' },
  { id: 'SPEC-017', domain: 'BOM ↔ Inventory Movement', status: 'FROZEN_CORE', summary: 'BOM tăng/giảm chỉ đề xuất điều chuyển; user phải xác nhận', nextAction: 'Prototype confirmation flow' },
  { id: 'SPEC-018', domain: 'Invoice Monitoring', status: 'PARTIAL', summary: 'Theo dõi Supplier đã có/chưa có hóa đơn; chưa phải accounting module', nextAction: 'Review customer demo' },
  { id: 'SPEC-019', domain: 'Import Material', status: 'DEFERRED_TO_PROTOTYPE_REVIEW', summary: 'Import Material tách riêng', nextAction: 'Chỉ hiển thị button' },
  { id: 'SPEC-020', domain: 'Import Supplier Price', status: 'DEFERRED_TO_PROTOTYPE_REVIEW', summary: 'Có bulk import, nhưng workflow/file schema chưa khóa', nextAction: 'Chỉ hiển thị button' },
  { id: 'SPEC-021', domain: 'Inventory Topology', status: 'NOT_STARTED', summary: 'Chưa chốt một kho hay nhiều kho và stock calculation', nextAction: 'Review sau prototype' },
  { id: 'SPEC-022', domain: 'Stock In / Stock Out', status: 'PARTIAL', summary: 'Sidebar và concept đã có nhưng transaction contract chưa đầy đủ', nextAction: 'Prototype placeholder' },
  { id: 'SPEC-023', domain: 'Dashboard KPI Formula', status: 'PARTIAL', summary: 'Dashboard structure đã chốt; công thức production chưa khóa', nextAction: 'Dùng mock data' },
  { id: 'SPEC-024', domain: 'API / Data Contracts', status: 'NOT_STARTED', summary: 'Chưa khóa production API, schema và integration contracts', nextAction: 'Hoàn thiện sau customer UI acceptance' },
  { id: 'SPEC-025', domain: 'NFR / Security / Backup / Deployment', status: 'NOT_STARTED', summary: 'Chưa final hóa technical NFR', nextAction: 'Technical SPEC phase' },
  { id: 'SPEC-026', domain: 'Final Acceptance & Work Orders', status: 'NOT_STARTED', summary: 'Production Build chưa được authorize', nextAction: 'Chỉ mở sau Final SPEC' },
];

const uis: UIModule[] = [
  { id: 'UI-001', module: 'App Identity', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Product Intent', customerDemo: 'Included', nextAction: 'Build header/sidebar identity' },
  { id: 'UI-002', module: 'Platform, i18n và Visual Style', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Product Intent', customerDemo: 'Included', nextAction: 'Build desktop-first shell' },
  { id: 'UI-003', module: 'Sidebar', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Authorization', customerDemo: 'Included', nextAction: 'Build fixed collapsible sidebar' },
  { id: 'UI-004', module: 'Icon System', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Authorization', customerDemo: 'Included', nextAction: 'Use one Lucide icon set' },
  { id: 'UI-005', module: 'Dashboard', status: 'FROZEN_FOR_CUSTOMER_DEMO', relatedSpec: 'Dashboard KPI', customerDemo: 'Included', nextAction: 'Use mock charts' },
  { id: 'UI-006', module: 'Danh mục hệ thống Tabs', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Master Data', customerDemo: 'Included', nextAction: 'Build tab navigation' },
  { id: 'UI-007', module: 'Project Master Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Project Master', customerDemo: 'Included', nextAction: 'Build list and form' },
  { id: 'UI-008', module: 'Customer Master Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Customer Master', customerDemo: 'Included', nextAction: 'Build list and form' },
  { id: 'UI-009', module: 'Material Category Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Material Category', customerDemo: 'Included', nextAction: 'Build tree + detail layout' },
  { id: 'UI-010', module: 'UOM Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'UOM', customerDemo: 'Included', nextAction: 'Build CRUD' },
  { id: 'UI-011', module: 'Manufacturer Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Manufacturer', customerDemo: 'Included', nextAction: 'Build CRUD' },
  { id: 'UI-012', module: 'Supplier Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Supplier Master', customerDemo: 'Included', nextAction: 'Build CRUD' },
  { id: 'UI-013', module: 'Material List', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Material Master', customerDemo: 'Included', nextAction: 'Build table, filters and actions' },
  { id: 'UI-014', module: 'Material Create/Edit', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Material Identity', customerDemo: 'Included', nextAction: 'Build shared form' },
  { id: 'UI-015', module: 'Material Detail', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Material + Supplier Price', customerDemo: 'Included', nextAction: 'Build General and Supplier Price tabs' },
  { id: 'UI-016', module: 'Supplier Detail', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Supplier + Price', customerDemo: 'Included', nextAction: 'Build General and Materials & Price tabs' },
  { id: 'UI-017', module: 'Manual Bulk Price Edit', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Price Snapshot', customerDemo: 'Included', nextAction: 'Build editable table mode' },
  { id: 'UI-018', module: 'Supplier Price Import', status: 'PLACEHOLDER', relatedSpec: 'Import Supplier Price', customerDemo: 'Included as button', nextAction: 'Review after first UI' },
  { id: 'UI-019', module: 'User Management', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Authorization', customerDemo: 'Included', nextAction: 'Build multi-role form' },
  { id: 'UI-020', module: 'Role & Permission', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Authorization', customerDemo: 'Included', nextAction: 'Build visibility/action tabs' },
  { id: 'UI-021', module: 'Cross-project Material Monitoring', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Project Monitoring', customerDemo: 'Included', nextAction: 'Build overview table' },
  { id: 'UI-022', module: 'Project Management Shell', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Project/BOM', customerDemo: 'Included', nextAction: 'Build header + four tabs' },
  { id: 'UI-023', module: 'Project Overview Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Project Monitoring', customerDemo: 'Included', nextAction: 'Use mock KPIs' },
  { id: 'UI-024', module: 'BOM & Supplier Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'BOM/Supplier Recommendation', customerDemo: 'Included', nextAction: 'Build table with Final Supplier' },
  { id: 'UI-025', module: 'Goods Receiving Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Goods Receiving', customerDemo: 'Included', nextAction: 'Build partial receiving and allocation modal' },
  { id: 'UI-026', module: 'Invoice Tab', status: 'FROZEN_FOR_PROTOTYPE_V0', relatedSpec: 'Invoice Monitoring', customerDemo: 'Included', nextAction: 'Build simple invoice status UI' },
  { id: 'UI-027', module: 'Stock In Page', status: 'PLACEHOLDER', relatedSpec: 'Stock In/Out', customerDemo: 'Placeholder', nextAction: 'Detail after demo' },
  { id: 'UI-028', module: 'Stock Out Page', status: 'PLACEHOLDER', relatedSpec: 'Stock In/Out', customerDemo: 'Placeholder', nextAction: 'Detail after demo' },
  { id: 'UI-029', module: 'Inventory History Page', status: 'PLACEHOLDER', relatedSpec: 'Inventory', customerDemo: 'Placeholder', nextAction: 'Detail after demo' },
  { id: 'UI-030', module: 'Import Material', status: 'PLACEHOLDER', relatedSpec: 'Import Material', customerDemo: 'Included as button', nextAction: 'Review after first UI' },
  { id: 'UI-031', module: 'Role Management Navigation', status: 'UI_PENDING', relatedSpec: 'Authorization', customerDemo: 'Included', nextAction: 'Decide inside User page or nested screen' },
  { id: 'UI-032', module: 'Mobile Optimization', status: 'NOT_STARTED', relatedSpec: 'Platform', customerDemo: 'Excluded', nextAction: 'Out of scope V1' },
];

const openItems: Decision[] = [
  { id: 'OPEN-001', domain: 'BOM', question: 'BOM có được chỉnh sau khi bắt đầu mua hàng và xử lý delta như thế nào?', status: 'DEFERRED_TO_PROTOTYPE_REVIEW', reviewTrigger: 'BOM prototype review' },
  { id: 'OPEN-002', domain: 'BOM', question: 'Có cần BOM version/revision chính thức không?', status: 'PARTIAL', reviewTrigger: 'Customer workflow review' },
  { id: 'OPEN-003', domain: 'Project', question: 'Project status enum gồm những trạng thái nào?', status: 'NEEDS_DECISION', reviewTrigger: 'Project UI review' },
  { id: 'OPEN-004', domain: 'Project', question: 'Điều kiện xóa Project là gì?', status: 'NEEDS_DECISION', reviewTrigger: 'Project lifecycle review' },
  { id: 'OPEN-005', domain: 'Inventory', question: 'Một kho hay nhiều kho?', status: 'NOT_STARTED', reviewTrigger: 'Inventory SPEC phase' },
  { id: 'OPEN-006', domain: 'Inventory', question: 'Cách tính available, reserved và physical stock?', status: 'NOT_STARTED', reviewTrigger: 'Inventory SPEC phase' },
  { id: 'OPEN-007', domain: 'Import', question: 'Schema, preview và validation của Import Material', status: 'DEFERRED_TO_PROTOTYPE_REVIEW', reviewTrigger: 'Import button review' },
  { id: 'OPEN-008', domain: 'Import', question: 'Schema, preview và validation của Supplier Price Import', status: 'DEFERRED_TO_PROTOTYPE_REVIEW', reviewTrigger: 'Supplier UI review' },
  { id: 'OPEN-009', domain: 'Invoice', question: 'Có cần partial invoice, adjustment hoặc payment status không?', status: 'PARTIAL', reviewTrigger: 'Customer demo' },
  { id: 'OPEN-010', domain: 'Dashboard', question: 'Công thức KPI production', status: 'PARTIAL', reviewTrigger: 'Production SPEC phase' },
  { id: 'OPEN-011', domain: 'Authorization UI', question: 'Role Management nằm trong User page hay nested route riêng?', status: 'UI_PENDING', reviewTrigger: 'First prototype review' },
  { id: 'OPEN-012', domain: 'Technical', question: 'API, database, auth, backup, deployment và NFR', status: 'NOT_STARTED', reviewTrigger: 'Final technical SPEC' },
];

const roadmap: RoadmapPhase[] = [
  {
    id: 'PHASE-1',
    name: 'Phase 1 — Product Discovery',
    status: 'IN_PROGRESS',
    mainOutputs: ['Product intent', 'Authorization', 'Master data foundation', 'Material rules', 'Supplier Price', 'Supplier recommendation', 'Goods receiving baseline']
  },
  {
    id: 'PHASE-2',
    name: 'Phase 2 — AI Studio Product Prototype',
    status: 'READY',
    purpose: 'Build CVF UI Prototype V0. Interact with UI. Reopen SPEC where necessary. Freeze customer-demo workflow.'
  },
  {
    id: 'PHASE-3',
    name: 'Phase 3 — Antigravity Handoff Demo',
    status: 'NOT_STARTED',
    purpose: 'Clean up prototype source. Organize components. Verify build and browser interactions. Move code to GitHub-controlled handoff state.'
  },
  { id: 'PHASE-4', name: 'Phase 4 — Customer Demo / UAT', status: 'NOT_STARTED' },
  { id: 'PHASE-5', name: 'Phase 5 — Customer Product Acceptance + Final SPEC', status: 'NOT_STARTED' },
  { id: 'PHASE-6', name: 'Phase 6 — Prototype Promotion Review', status: 'NOT_STARTED' },
  { id: 'PHASE-7', name: 'Phase 7 — Developer Work Orders & Production Build', status: 'NOT_STARTED' }
];

export const seedData: AppState = {
  metadata,
  specs,
  uis,
  decisions: [],
  openItems,
  roadmap,
  changelog: []
};
