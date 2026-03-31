import React, { useMemo, useState } from "react";

const makeCourse = (id, subject = "", ects = "", grade = "") => ({
  id,
  subject,
  ects,
  grade,
});

export default function App() {
  const [courses, setCourses] = useState([
    makeCourse(1, "ADS", "3", ""),
    makeCourse(2, "OOP", "4", ""),
  ]);

  const updateCourse = (id, field, value) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const addCourse = () => {
    setCourses((prev) => [...prev, makeCourse(Date.now())]);
  };

  const removeCourse = (id) => {
    if (courses.length === 1) return;
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const resetAll = () => {
    setCourses([makeCourse(1)]);
  };

  const stats = useMemo(() => {
    const validCourses = courses.filter((course) => {
      const ects = parseFloat(course.ects);
      const grade = parseFloat(course.grade);
      return !Number.isNaN(ects) && ects > 0 && !Number.isNaN(grade);
    });

    const totalECTS = validCourses.reduce(
      (sum, course) => sum + parseFloat(course.ects),
      0
    );

    const weightedTotal = validCourses.reduce(
      (sum, course) => sum + parseFloat(course.ects) * parseFloat(course.grade),
      0
    );

    const average = totalECTS > 0 ? weightedTotal / totalECTS : 0;

    return {
      totalECTS,
      average,
      validCount: validCourses.length,
    };
  }, [courses]);

  const getMention = (grade) => {
    if (grade >= 17) return "+59tr";
    if (grade >= 15.5) return "mút";
    if (grade >= 15) return "thêm tí nữa có học bổng :)";
    if (grade >= 13) return "cố lên mấy con vợ";
    if (grade >= 10) return "vừa khít";
    return "ô mê đê tô học lại e nhé";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>USTH GPA Calculator</h1>
        <p style={styles.subtitle}>
          Enter your subjects, ECTS, and grades out of 20. Information entered
          here is for calculation purposes only and will not be collected.
        </p>

        <div style={styles.topButtons}>
          <button onClick={addCourse} style={styles.primaryButton}>
            Add subject
          </button>
          <button onClick={resetAll} style={styles.secondaryButton}>
            Reset
          </button>
        </div>

        <div style={styles.layout}>
          <div style={styles.leftPanel}>
            <div style={styles.headerRow}>
              <div style={{ ...styles.headerCell, flex: 2 }}>Subject</div>
              <div style={styles.headerCell}>ECTS</div>
              <div style={styles.headerCell}>Grade / 20</div>
              <div style={styles.headerCell}>Action</div>
            </div>

            {courses.map((course, index) => (
              <div key={course.id} style={styles.row}>
                <div style={{ ...styles.cell, flex: 2 }}>
                  <label style={styles.label}>Subject {index + 1}</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Subjet"
                    value={course.subject}
                    onChange={(e) =>
                      updateCourse(course.id, "subject", e.target.value)
                    }
                  />
                </div>

                <div style={styles.cell}>
                  <label style={styles.label}>ECTS</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="4"
                    value={course.ects}
                    onChange={(e) =>
                      updateCourse(course.id, "ects", e.target.value)
                    }
                  />
                </div>

                <div style={styles.cell}>
                  <label style={styles.label}>Grade / 20</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="20"
                    value={course.grade}
                    onChange={(e) =>
                      updateCourse(course.id, "grade", e.target.value)
                    }
                  />
                </div>

                <div style={styles.cell}>
                  <label style={styles.label}>Remove</label>
                  <button
                    onClick={() => removeCourse(course.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.rightPanel}>
            <h2 style={styles.resultTitle}>Result</h2>
            <div style={styles.resultBox}>
              <div style={styles.resultLabel}>Weighted average</div>
              <div style={styles.resultNumber}>
                {stats.average.toFixed(2)} / 20
              </div>
              <div style={styles.resultMention}>
                Mention: {getMention(stats.average)}
              </div>
            </div>

            <div style={styles.infoBox}>Total ECTS: {stats.totalECTS}</div>
            <div style={styles.infoBox}>Valid Subjects: {stats.validCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
    padding: "30px 20px",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#555",
  },
  topButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #bbb",
    backgroundColor: "white",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
  },
  leftPanel: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  rightPanel: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    height: "fit-content",
  },
  headerRow: {
    display: "flex",
    gap: "12px",
    fontWeight: "bold",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  headerCell: {
    flex: 1,
    minWidth: "120px",
  },
  row: {
    display: "flex",
    gap: "12px",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  cell: {
    flex: 1,
    minWidth: "120px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "13px",
    marginBottom: "6px",
    color: "#444",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #bbb",
    fontSize: "14px",
  },
  deleteButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #c44",
    backgroundColor: "white",
    cursor: "pointer",
  },
  resultTitle: {
    marginTop: 0,
  },
  resultBox: {
    padding: "16px",
    borderRadius: "10px",
    backgroundColor: "#f1f3f5",
    marginBottom: "14px",
  },
  resultLabel: {
    fontSize: "14px",
    color: "#555",
  },
  resultNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  resultMention: {
    color: "#444",
  },
  infoBox: {
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "12px",
  },
  noteBox: {
    padding: "14px",
    border: "1px dashed #aaa",
    borderRadius: "10px",
    color: "#444",
  },
};
