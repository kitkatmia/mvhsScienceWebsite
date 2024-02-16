import React from 'react'

type Title = {
    title: String
}

const PageTitle = ({ title }: Title) => {
  return (
    <h1 style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0
    }}>
      {title}
    </h1>
  )
}

export default PageTitle