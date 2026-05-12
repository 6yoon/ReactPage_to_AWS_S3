import { useEffect, useMemo, useState } from 'react';
import { initialStudies } from './data';

const STORAGE_KEY = 'studyRecruitBoardData';
const categories = ['전체', '코딩', '영어', '자격증', '전공', '취업', '기타'];
const categoryOptions = ['코딩', '영어', '자격증', '전공', '취업', '기타'];
const methodOptions = ['온라인', '오프라인', '혼합'];

const emptyForm = {
  title: '',
  category: '코딩',
  maxMembers: '',
  method: '온라인',
  schedule: '',
  location: '',
  description: '',
  tags: '',
};

function loadStudies() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return initialStudies;
  }

  try {
    const parsedData = JSON.parse(savedData);
    return Array.isArray(parsedData) ? parsedData : initialStudies;
  } catch {
    return initialStudies;
  }
}

function App() {
  const [studies, setStudies] = useState(loadStudies);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studies));
  }, [studies]);

  const stats = useMemo(() => {
    return {
      total: studies.length,
      open: studies.filter((study) => study.status === '모집 중').length,
      closed: studies.filter((study) => study.status === '마감').length,
      applicants: studies.reduce((sum, study) => sum + Number(study.currentMembers), 0),
    };
  }, [studies]);

  const filteredStudies = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return studies.filter((study) => {
      const matchesKeyword =
        !keyword ||
        study.title.toLowerCase().includes(keyword) ||
        study.description.toLowerCase().includes(keyword) ||
        study.tags.some((tag) => tag.toLowerCase().includes(keyword));
      const matchesCategory = selectedCategory === '전체' || study.category === selectedCategory;
      const matchesStatus = statusFilter === '전체' || study.status === statusFilter;

      return matchesKeyword && matchesCategory && matchesStatus;
    });
  }, [studies, searchTerm, selectedCategory, statusFilter]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const maxMembers = Number(form.maxMembers);
    const requiredFields = [
      form.title.trim(),
      form.category,
      form.maxMembers,
      form.method,
      form.schedule.trim(),
      form.location.trim(),
      form.description.trim(),
    ];

    if (requiredFields.some((field) => !field) || !Number.isInteger(maxMembers) || maxMembers < 1) {
      alert('제목, 분야, 모집 인원, 진행 방식, 요일/시간, 장소, 설명을 올바르게 입력해주세요.');
      return;
    }

    const newStudy = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      status: '모집 중',
      maxMembers,
      currentMembers: 0,
      method: form.method,
      schedule: form.schedule.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setStudies((currentStudies) => [newStudy, ...currentStudies]);
    setForm(emptyForm);
  };

  const handleApply = (studyId) => {
    setStudies((currentStudies) =>
      currentStudies.map((study) => {
        if (study.id !== studyId || study.status === '마감' || study.currentMembers >= study.maxMembers) {
          return study;
        }

        const nextCurrentMembers = study.currentMembers + 1;

        return {
          ...study,
          currentMembers: nextCurrentMembers,
          status: nextCurrentMembers >= study.maxMembers ? '마감' : study.status,
        };
      }),
    );
  };

  const handleToggleStatus = (studyId) => {
    setStudies((currentStudies) =>
      currentStudies.map((study) => {
        if (study.id !== studyId) {
          return study;
        }

        return {
          ...study,
          status: study.status === '모집 중' ? '마감' : '모집 중',
        };
      }),
    );
  };

  const handleDelete = (studyId) => {
    if (!confirm('해당 스터디를 삭제할까요?')) {
      return;
    }

    setStudies((currentStudies) => currentStudies.filter((study) => study.id !== studyId));
  };

  const handleReset = () => {
    if (!confirm('저장된 데이터를 지우고 초기 데이터로 복원할까요?')) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setStudies(initialStudies);
    setSearchTerm('');
    setSelectedCategory('전체');
    setStatusFilter('전체');
  };

  return (
    <main className="app">
      <header className="hero-section">
        <div>
          <p className="eyebrow">Campus Study Community</p>
          <h1>스터디 모집 게시판</h1>
          <p className="hero-description">
            관심 분야의 스터디를 찾고, 직접 모집 글을 등록하며 모집 상태를 간편하게 관리하세요.
          </p>
        </div>
        <button type="button" className="reset-button" onClick={handleReset}>
          초기 데이터로 복원
        </button>
      </header>

      <section className="stats-grid" aria-label="스터디 통계">
        <StatCard label="전체 스터디 수" value={stats.total} />
        <StatCard label="모집 중인 스터디 수" value={stats.open} />
        <StatCard label="마감된 스터디 수" value={stats.closed} />
        <StatCard label="전체 신청 인원 수" value={stats.applicants} />
      </section>

      <section className="panel form-panel">
        <div className="section-heading">
          <h2>스터디 등록</h2>
          <p>새로운 모집 글은 목록 맨 위에 추가됩니다.</p>
        </div>

        <form className="study-form" onSubmit={handleSubmit}>
          <label>
            제목
            <input name="title" value={form.title} onChange={handleInputChange} placeholder="예: JavaScript 알고리즘 스터디" />
          </label>

          <label>
            분야
            <select name="category" value={form.category} onChange={handleInputChange}>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            모집 인원
            <input
              name="maxMembers"
              type="number"
              min="1"
              value={form.maxMembers}
              onChange={handleInputChange}
              placeholder="예: 6"
            />
          </label>

          <label>
            진행 방식
            <select name="method" value={form.method} onChange={handleInputChange}>
              {methodOptions.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label>
            요일/시간
            <input name="schedule" value={form.schedule} onChange={handleInputChange} placeholder="예: 화/목 20:00" />
          </label>

          <label>
            장소
            <input name="location" value={form.location} onChange={handleInputChange} placeholder="예: 중앙도서관 2층" />
          </label>

          <label className="full-width">
            설명
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleInputChange}
              placeholder="스터디 목표, 진행 방식, 준비물 등을 적어주세요."
            />
          </label>

          <label className="full-width">
            태그
            <input name="tags" value={form.tags} onChange={handleInputChange} placeholder="React, 프론트엔드, 초보환영" />
          </label>

          <button type="submit" className="primary-button full-width">
            등록하기
          </button>
        </form>
      </section>

      <section className="panel controls-panel">
        <div className="search-row">
          <label className="search-field">
            검색
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="제목, 설명, 태그로 검색"
            />
          </label>

          <label className="status-select">
            모집 상태
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="전체">전체</option>
              <option value="모집 중">모집 중</option>
              <option value="마감">마감</option>
            </select>
          </label>
        </div>

        <div className="category-filter" aria-label="분야별 필터">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="study-list-section">
        <div className="list-heading">
          <h2>스터디 목록</h2>
          <span>{filteredStudies.length}개 표시 중</span>
        </div>

        {filteredStudies.length > 0 ? (
          <div className="study-grid">
            {filteredStudies.map((study) => (
              <StudyCard
                key={study.id}
                study={study}
                onApply={handleApply}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="empty-message">조건에 맞는 스터디가 없습니다.</p>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StudyCard({ study, onApply, onToggleStatus, onDelete }) {
  const isClosed = study.status === '마감' || study.currentMembers >= study.maxMembers;

  return (
    <article className="study-card">
      <div className="card-top">
        <span className={`status-badge ${study.status === '모집 중' ? 'open' : 'closed'}`}>{study.status}</span>
        <span className="created-date">{study.createdAt}</span>
      </div>

      <h3>{study.title}</h3>
      <p className="description">{study.description}</p>

      <dl className="study-meta">
        <div>
          <dt>분야</dt>
          <dd>{study.category}</dd>
        </div>
        <div>
          <dt>모집</dt>
          <dd>
            {study.currentMembers} / {study.maxMembers}명
          </dd>
        </div>
        <div>
          <dt>방식</dt>
          <dd>{study.method}</dd>
        </div>
        <div>
          <dt>시간</dt>
          <dd>{study.schedule}</dd>
        </div>
        <div className="wide-meta">
          <dt>장소</dt>
          <dd>{study.location}</dd>
        </div>
      </dl>

      <div className="tag-list">
        {study.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <div className="card-actions">
        <button type="button" className="primary-button" onClick={() => onApply(study.id)} disabled={isClosed}>
          신청하기
        </button>
        <button type="button" className="secondary-button" onClick={() => onToggleStatus(study.id)}>
          {study.status === '모집 중' ? '모집 마감' : '모집 재개'}
        </button>
        <button type="button" className="danger-button" onClick={() => onDelete(study.id)}>
          삭제
        </button>
      </div>
    </article>
  );
}

export default App;
