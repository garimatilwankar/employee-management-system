import { useEffect, useState } from "react";
import api from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");

  useEffect(() => {
    api.get("/skills")
      .then((res) => setSkills(res.data || []))
      .catch(console.error);
  }, []);

  const addSkill = async () => {
    if (!skillName.trim()) {
      return;
    }

    await api.post("/skills", { skill_name: skillName });
    setSkillName("");
    const res = await api.get("/skills");
    setSkills(res.data || []);
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Skills Catalog</p>
          <h2>Skills Master</h2>
          <p className="page-description">Create and maintain the skills taxonomy used in employee profiles.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="form-field">
          <label>Skill Name</label>
          <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Add new skill" />
        </div>
        <button className="button button--primary" onClick={addSkill}>Add Skill</button>
      </div>

      <div className="panel-card">
        <h3>Skill Items</h3>
        <ul className="simple-list">
          {skills.map((skill) => (
            <li key={skill.id}>{skill.skill_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Skills;
