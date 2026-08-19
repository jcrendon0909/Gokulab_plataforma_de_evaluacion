.test-liderazgo-container {
  padding: 20px 0;
}

.step-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

/* Reutilizar estilos de Test1Container */
.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.step-icon { font-size: 2.5rem; }
.step-title { font-size: 2rem; font-weight: 800; color: #1a1a2e; }
.step-description { color: #555; line-height: 1.8; font-size: 1.05rem; margin-bottom: 25px; }
.info-box { background: #f0fffe; border-left: 4px solid #26aaa3; padding: 20px 25px; border-radius: 0 10px 10px 0; margin-bottom: 25px; }
.info-box h4 { color: #26aaa3; margin-bottom: 10px; }
.info-box ul { list-style: none; padding: 0; }
.info-box ul li { padding: 5px 0; color: #444; }

.form-section { background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px; }
.form-section h4 { color: #26aaa3; margin-bottom: 15px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }

.progress-header { margin-bottom: 20px; }
.progress-info { display: flex; justify-content: space-between; font-weight: 600; color: #555; margin-bottom: 8px; }
.progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #26aaa3, #67a934); border-radius: 4px; }
.dimension-progress .progress-fill { background: #f8b50e; }

.dimension-header { border-left: 4px solid #26aaa3; padding-left: 15px; margin-bottom: 20px; }
.dimension-header h3 { font-size: 1.3rem; color: #1a1a2e; }
.dimension-header p { color: #666; }

.questions-container { display: flex; flex-direction: column; gap: 15px; margin: 20px 0; }
.question-item { background: #f8f9fa; padding: 15px 20px; border-radius: 10px; border: 2px solid transparent; transition: all 0.3s; }
.question-item:hover { border-color: #26aaa3; }
.question-text { font-weight: 500; margin-bottom: 10px; }

.scale-options { display: flex; gap: 10px; flex-wrap: wrap; }
.scale-option { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 6px 12px; border-radius: 8px; background: white; border: 2px solid #e0e0e0; transition: all 0.3s; min-width: 40px; }
.scale-option:hover { border-color: #26aaa3; }
.scale-option input { display: none; }
.scale-option span { font-weight: 600; color: #555; }
.scale-option.selected { border-color: #26aaa3; background: #e8f8f7; }
.scale-option.selected span { color: #26aaa3; }

.navigation-buttons { display: flex; justify-content: space-between; gap: 15px; margin-top: 20px; }
.navigation-buttons .btn { min-width: 150px; }

.puntaje-total-liderazgo { background: linear-gradient(135deg, #26aaa3, #67a934); color: white; padding: 25px; border-radius: 15px; text-align: center; margin-bottom: 20px; }
.puntaje-total-liderazgo .puntaje-numero { font-size: 3rem; font-weight: 800; }
.puntaje-total-liderazgo .puntaje-categoria { font-size: 1.3rem; font-weight: 600; margin-top: 5px; }

.results-grid-liderazgo { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
.result-card-liderazgo { background: #f8f9fa; padding: 18px; border-radius: 12px; text-align: center; border: 2px solid transparent; }
.result-card-liderazgo .dim-icon { font-size: 2rem; }
.result-card-liderazgo h4 { font-size: 0.9rem; color: #26aaa3; margin: 5px 0; }
.result-card-liderazgo .score { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
.result-card-liderazgo .nivel { font-size: 0.85rem; font-weight: 600; color: #666; }
.mini-bar-liderazgo { background: #e9ecef; height: 6px; border-radius: 3px; margin-top: 8px; overflow: hidden; }
.mini-fill-liderazgo { height: 100%; border-radius: 3px; }

.perfil-descripcion { background: #f0f7ff; padding: 20px; border-radius: 12px; border-left: 4px solid #4a90d9; margin-bottom: 20px; }
.perfil-descripcion h4 { color: #4a90d9; margin-bottom: 8px; }

.result-actions { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
.result-actions .btn { min-width: 160px; }

@media (max-width: 768px) {
  .step-container { padding: 20px; }
  .step-title { font-size: 1.5rem; }
  .form-grid { grid-template-columns: 1fr; }
  .navigation-buttons { flex-direction: column; }
  .navigation-buttons .btn { width: 100%; min-width: unset; }
  .results-grid-liderazgo { grid-template-columns: 1fr 1fr; }
  .puntaje-total-liderazgo .puntaje-numero { font-size: 2.5rem; }
}