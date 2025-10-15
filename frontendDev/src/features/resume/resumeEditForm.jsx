import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Textarea } from "../../components/index";
import { fetchResumeById, updateResume } from "./resumeSlice";

function ResumeEditForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentResume, loading: globalLoading } = useSelector(
    (state) => state.resumes
  );
  const [loading, setLoading] = useState(false);

  console.log(id);
  

  // Fetch the resume by ID
  useEffect(() => {
    dispatch(fetchResumeById(id));
  }, [dispatch, id]);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      sections: {
        summary: "",
        education: [{ school: "", degree: "", startDate: "", endDate: "" }],
        experience: [
          { company: "", position: "", startDate: "", endDate: "", description: "" },
        ],
        skills: [""],
        projects: [{ name: "", description: "", link: "" }],
      },
    },
  });

  // When resume is fetched, reset the form with its values
  useEffect(() => {
    if (currentResume) {
      reset(currentResume);
    }
  }, [currentResume, reset]);

  const educationFields = useFieldArray({ control, name: "sections.education" });
  const experienceFields = useFieldArray({ control, name: "sections.experience" });
  const skillsFields = useFieldArray({ control, name: "sections.skills" });
  const projectsFields = useFieldArray({ control, name: "sections.projects" });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await dispatch(updateResume({ resumeId: id, data })).unwrap();
      navigate(`/resumes/${id}`);
    } catch (err) {
      console.error("Failed to update resume:", err);
    } finally {
      setLoading(false);
    }
  };

  if (globalLoading && !currentResume) {
    return <p className="text-center mt-10">Loading resume...</p>;
  }

  const handleCancel = () => {
    navigate(`/resumes/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 border border-gray-200">

        <div className="flex justify-end">
        <button
          type="button" 
          onClick={handleCancel}
          className="px-5 py-2 text-l rounded-md bg-gray-200 hover:bg-red-500 hover:text-white cursor-pointer text-gray-700 transition "
        >
          Cancel
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Resume
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <Input
          label="Resume Title"
          className="w-full"
          {...register("title", { required: true })}
        />

        {/* Summary */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Summary</h3>
          <Textarea
            placeholder="Write a short professional summary..."
            {...register("sections.summary")}
          />
        </div>

        {/* Education */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Education</h3>
          <div className="space-y-4">
            {educationFields.fields.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-gray-50 space-y-3"
              >
                <Input label="School" {...register(`sections.education.${index}.school`)} />
                <Input label="Degree" {...register(`sections.education.${index}.degree`)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    {...register(`sections.education.${index}.startDate`)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    {...register(`sections.education.${index}.endDate`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => educationFields.remove(index)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                >
                  Remove Education
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                educationFields.append({
                  school: "",
                  degree: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition cursor-pointer flex justify-between items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg> Add Education
            </button>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Experience</h3>
          <div className="space-y-4">
            {experienceFields.fields.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-gray-50 space-y-3"
              >
                <Input
                  label="Company"
                  {...register(`sections.experience.${index}.company`)}
                />
                <Input
                  label="Position"
                  {...register(`sections.experience.${index}.position`)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    {...register(`sections.experience.${index}.startDate`)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    {...register(`sections.experience.${index}.endDate`)}
                  />
                </div>
                <Textarea
                  label="Description"
                  {...register(`sections.experience.${index}.description`)}
                />
                <button
                  type="button"
                  onClick={() => experienceFields.remove(index)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                experienceFields.append({
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition cursor-pointer flex justify-between items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg> Add Experience
            </button>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Skills</h3>
          <div className="space-y-2">
            {skillsFields.fields.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  placeholder="Skill"
                  {...register(`sections.skills.${index}`)}
                />
                <button
                  type="button"
                  onClick={() => skillsFields.remove(index)}
                  className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => skillsFields.append("")}
              className="px-3 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition cursor-pointer flex justify-between items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>Add Skill
            </button>
          </div>
        </div>

        {/* Projects */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Projects</h3>
          <div className="space-y-4">
            {projectsFields.fields.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-gray-50 space-y-3"
              >
                <Input
                  label="Name"
                  {...register(`sections.projects.${index}.name`)}
                />
                <Textarea
                  label="Description"
                  {...register(`sections.projects.${index}.description`)}
                />
                <Input
                  label="Link"
                  {...register(`sections.projects.${index}.link`)}
                />
                <button
                  type="button"
                  onClick={() => projectsFields.remove(index)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                projectsFields.append({ name: "", description: "", link: "" })
              }
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition cursor-pointer flex justify-between items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg> Add Project
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 text-white"
            } cursor-pointer`}
          >
            {loading ? "Updating..." : "Update Resume"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResumeEditForm;
