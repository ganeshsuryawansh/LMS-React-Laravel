import React, { useEffect, useState } from 'react'
import Course from '../common/Course'
import Layout from '../common/Layout'
import { apiUrl } from '../common/Config';
import { useSearchParams } from 'react-router-dom';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });

  const [levelChecked, setlevelChecked] = useState(() => {
    const level = searchParams.get('level');
    return level ? level.split(',') : [];
  });

  const [languageChecked, setLanguageChecked] = useState(() => {
    const language = searchParams.get('language');
    return language ? language.split(',') : [];
  });

  const handleLanguage = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setLanguageChecked(prev => [...prev, value])
    } else {
      setLanguageChecked(languageChecked.filter((v) => v != value))
    }
  }

  const handleLevel = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setlevelChecked(prev => [...prev, value])
    } else {
      setlevelChecked(levelChecked.filter((v) => v != value))
    }
  }

  const handleCategory = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      setCategoryChecked(prev => [...prev, value])
    } else {
      setCategoryChecked(categoryChecked.filter((v) => v != value))
    }
  }

  const fetchCourses = async () => {

    let search = [];
    let params = "";

    if (categoryChecked.length > 0) {
      search.push(['category', categoryChecked]);
    }

    if (levelChecked.length > 0) {
      search.push(['level', levelChecked]);
    }

    if (languageChecked.length > 0) {
      search.push(['language', languageChecked]);
    }

    if (keyword.length > 0) {
      search.push(['keyword', keyword]);
    }

    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    } else {
      setSearchParams([]);
    }

    await fetch(`${apiUrl}/fetch-courses?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result);

        if (result.status == 200) {
          setCourses(result.data);
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(err => console.log(err));
  }

  const fetchCategories = async () => {
    await fetch(`${apiUrl}/fetch-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result);

        if (result.status == 200) {
          setCategories(result.data);
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(err => console.log(err));
  }

  const fetchLevels = async () => {
    await fetch(`${apiUrl}/fetch-levels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result);

        if (result.status == 200) {
          setLevels(result.data);
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(err => console.log(err));
  }

  const fetchLanguages = async () => {
    await fetch(`${apiUrl}/fetch-languages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result);

        if (result.status == 200) {
          setLanguages(result.data);
        } else {
          console.log('Something went wrong');
        }
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    fetchCourses();
  }, [categoryChecked, levelChecked, languageChecked, keyword]);

  useEffect(() => {
    fetchCategories();
    fetchLevels();
    fetchLanguages();
  }, []);

  return (
    <Layout>
      <div className='container pb-5 pt-3'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Courses</li>
          </ol>
        </nav>
        <div className='row'>
          <div className='col-lg-3'>
            <div className='sidebar mb-5 card border-0'>
              <div className='card-body shadow'>

                <div className='mb-3 input-group'>
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    type="text"
                    className='form-control'
                    placeholder='Search by keyword' />
                  <button className='btn btn-primary btn-sm'>Search</button>
                </div>

                <div className='pt-3'>
                  <h3 className='h5 mb-2'>Category</h3>
                  <ul>
                    {
                      categories && categories.map((category) => {
                        return (
                          <li key={category.id}>
                            <div className="form-check">
                              <input
                                defaultChecked={searchParams.get('category') ? searchParams.get('category').includes(category.id) : false}
                                onClick={(e) => handleCategory(e)}
                                className="form-check-input"
                                type="checkbox"
                                value={category.id}
                                id={`category-${category.id}`}
                              />
                              <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                {category.name}
                              </label>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
                <div className='mb-3'>
                  <h3 className='h5  mb-2'>Level</h3>
                  <ul>
                    {
                      levels && levels.map((level) => {
                        return (
                          <li key={level.id}>
                            <div className="form-check">

                              <input
                                defaultChecked={searchParams.get('level') ? searchParams.get('level').includes(level.id) : false}
                                onClick={(e) => handleLevel(e)}
                                className="form-check-input"
                                type="checkbox"
                                value={level.id}
                                id={`level-${level.id}`} />

                              <label className="form-check-label" htmlFor={`level-${level.id}`}>
                                {level.name}
                              </label>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
                <div className='mb-3'>
                  <h3 className='h5 mb-2'>Language</h3>
                  <ul>
                    {
                      languages && languages.map((language) => {
                        return (
                          <li key={language.id}>
                            <div className="form-check">
                              <input
                                defaultChecked={searchParams.get('language') ? searchParams.get('language').includes(language.id) : false}
                                onClick={(e) => handleLanguage(e)}
                                className="form-check-input"
                                type="checkbox"
                                value={language.id}
                                id={`language-${language.id}`} />
                              <label className="form-check-label" htmlFor={`language-${language.id}`}>
                                {language.name}
                              </label>
                            </div>
                          </li>
                        )
                      })
                    }

                  </ul>
                </div>
                <a href="" className='clear-filter'>Clear All Filters</a>
              </div>
            </div>
          </div>
          <div className='col-lg-9'>
            <section className='section-3'>
              <div className='d-flex justify-content-between mb-3 align-items-center'>
                <div className='h5 mb-0'>
                  {/* 10 courses found */}
                </div>
                <div>
                  <select name="" id="" className='form-select'>
                    <option value="0">Newset First</option>
                    <option value="1">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="row gy-4">

                {
                  courses && courses.map((c) => {
                    return (
                      <Course
                        key={c.id}
                        course={c}
                        customClasses="col-lg-3 col-md-6"
                      />
                    )
                  })
                }

              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Courses