# Portfolio Data Structure (`data.json`)

This document outlines the structure and purpose of the `data.json` file, which serves as the primary data source for the portfolio website.

## Root Object

The JSON file has a single root object containing the following main keys:

- `personal_info`
- `projects_num`
- `experience_num`
- `customers_num`
- `skills`
- `education`
- `experience`
- `projects`

---

### 1. `personal_info`

This object holds all personal and contact information.

| Key             | Type    | Description                                                  |
| --------------- | ------- | ------------------------------------------------------------ |
| `name`          | String  | The full name of the individual.                             |
| `title`         | String  | The professional title or headline.                          |
| `profile_image` | String  | The relative path to the profile picture.                    |
| `location`      | String  | The current city and country.                                |
| `contact`       | Object  | Contains contact details.                                    |
| ↳ `phone`       | String  | The phone number.                                            |
| ↳ `email`       | String  | The email address.                                           |
| `social_links`  | Array   | An array of social media profile objects.                    |
| ↳ `platform`    | String  | The name of the social media platform (e.g., "GitHub").      |
| ↳ `url`         | String  | The URL to the profile.                                      |
| `cv_download`   | String  | The relative path to the downloadable resume/CV file.        |
| `about_me`      | String  | A short paragraph describing the individual's professional background. |

---

### 2. Numeric Summaries

These keys provide a quick summary of counts.

| Key              | Type   | Description                            |
| ---------------- | ------ | -------------------------------------- |
| `projects_num`   | String | The total number of projects.          |
| `experience_num` | String | The years of experience.               |
| `customers_num`  | String | The number of clients or customers.    |

---

### 3. `skills`

This object contains two arrays detailing soft and technical skills.

| Key                | Type    | Description                                                  |
| ------------------ | ------- | ------------------------------------------------------------ |
| `soft_skills`      | Array   | An array of strings, where each string is a soft skill.      |
| `technical_skills` | Array   | An array of strings, where each string is a technical skill. |

---

### 4. `education`

This is an array of objects, where each object represents a distinct educational qualification.

| Key           | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| `degree`      | String | The name of the degree or field of study.    |
| `institution` | String | The name of the university or institution.   |
| `date_range`  | String | The start and end years of the study period. |

---

### 5. `experience`

This is an array of objects, where each object represents a professional work experience.

| Key                  | Type    | Description                                                  |
| -------------------- | ------- | ------------------------------------------------------------ |
| `title`              | String  | The job title.                                               |
| `company`            | String  | The name of the company.                                     |
| `location`           | String  | The location of the company.                                 |
| `date_range`         | String  | The start and end dates of the employment.                   |
| `description_points` | Array   | An array of strings, with each string being a bullet point describing responsibilities and achievements. |

---

### 6. `projects`

This is an array of objects, where each object represents a single project.

| Key                 | Type    | Description                                                  |
| ------------------- | ------- | ------------------------------------------------------------ |
| `name`              | String  | The name of the project.                                     |
| `cover_image`       | String  | The relative path to the project's cover image.              |
| `short_description` | String  | A brief, one-sentence summary of the project.                |
| `description`       | String  | A more detailed paragraph describing the project.            |
| `features`          | Array   | An array of strings, with each string listing a key feature. |
| `technologies_used` | Array   | An array of strings, listing the technologies and libraries used. |
| `links`             | Array   | An array of objects, each representing a link related to the project. |
| ↳ `type`            | String  | The type of link (e.g., "GitHub", "Google Play").            |
| ↳ `url`             | String  | The URL for the link.                                        |
| `media`             | Array   | An array of objects for project screenshots or GIFs.         |
| ↳ `type`            | String  | The type of media ("screenshot" or "gif").                   |
| ↳ `url`             | String  | The relative path to the media file.                         |
