import { useEffect, useState } from "react";
import axios from "axios";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");

  const loadSkills = () => {
    axios
      .get("http://localhost:5000/api/skills")
      .then((res) => {
        setSkills(res.data);
      });
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const addSkill = async () => {
    await axios.post(
      "http://localhost:5000/api/skills",
      {
        skill_name: skillName
      }
    );

    setSkillName("");
    loadSkills();
  };

  return (
    <div>
      <h2>Skills Master</h2>

      <input
        type="text"
        placeholder="Skill Name"
        value={skillName}
        onChange={(e) =>
          setSkillName(e.target.value)
        }
      />

      <button onClick={addSkill}>
        Add Skill
      </button>

      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>
            {skill.skill_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Skills;