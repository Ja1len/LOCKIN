# LOCKIN Database Design

## Users

Fields:
- user_id
- name
- school
- course
- theme

## Study Sessions

Fields:
- session_id
- user_id
- subject
- duration
- date

## Rooms

Fields:
- room_id
- name
- subject
- type
- participants

## Documents

Fields:
- document_id
- user_id
- filename
- content

## Quiz Results

Fields:
- quiz_id
- user_id
- topic
- score
- weak_topics
