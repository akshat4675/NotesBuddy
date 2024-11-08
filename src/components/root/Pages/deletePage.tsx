import React, { useEffect, useState } from 'react';
import { deleteSubject, deleteUnit } from '../Funtions/delete';
import { addSubject, addUnit, getSubjects, getUnits } from"../Funtions/PdfuploadF";
import { v4 as uuidv4 } from 'uuid';

const SubjectUnitManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [newUnitName, setNewUnitName] = useState<string>('');
  const [newUnitFile, setNewUnitFile] = useState<File | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subjects = await getSubjects();
      setSubjects(subjects);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  const loadUnits = async (subjectId: string) => {
    try {
      const units = await getUnits(subjectId);
      setUnits(units);
      setSelectedSubjectId(subjectId);
    } catch (error) {
      console.error("Failed to load units:", error);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    try {
      await addSubject(newSubjectName);
      setNewSubjectName('');
      loadSubjects();
    } catch (error) {
      console.error("Failed to add subject:", error);
    }
  };

  const handleDeleteSubject = async (name: string) => {
    try {
      await deleteSubject(name);
      if (selectedSubjectId === name) {
        setSelectedSubjectId(null);
        setUnits([]);
      }
      loadSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  const handleAddUnit = async () => {
    if (!selectedSubjectId || !newUnitName.trim() || !newUnitFile) return;
    try {
      await addUnit(selectedSubjectId, newUnitName, newUnitFile);
      setNewUnitName('');
      setNewUnitFile(null);
      loadUnits(selectedSubjectId);
    } catch (error) {
      console.error("Failed to add unit:", error);
    }
  };

  const handleDeleteUnit = async (subjectId: string, fileName: string) => {
    if (!selectedSubjectId) return;
    try {
      await deleteUnit(selectedSubjectId, subjectId, fileName);
      loadUnits(selectedSubjectId);
    } catch (error) {
      console.error("Failed to delete unit:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Subjects and Units Management</h1>

      {/* Subject List */}
      <div>
        <h2>Subjects</h2>
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="New Subject Name"
        />
        <button onClick={handleAddSubject}>Add Subject</button>
        <ul>
          {subjects.map((subject) => (
            <li key={subject.id}>
              <span>{subject.name}</span>
              <button onClick={() => loadUnits(subject.id)}>View Units</button>
              <button onClick={() => handleDeleteSubject(subject.id)}>Delete Subject</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Unit List for Selected Subject */}
      {selectedSubjectId && (
        <div>
          <h2>Units for Subject: {selectedSubjectId}</h2>
          <input
            type="text"
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
            placeholder="New Unit Name"
          />
          <input type="file" onChange={(e) => setNewUnitFile(e.target.files?.[0] || null)} />
          <button onClick={handleAddUnit}>Add Unit</button>
          <ul>
            {units.map((unit) => (
              <li key={unit.id}>
                <span>{unit.name}</span>
                <a href={unit.pdfUrl} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
                <button onClick={() => handleDeleteUnit(unit.id, unit.name)}>Delete Unit</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubjectUnitManagement;
