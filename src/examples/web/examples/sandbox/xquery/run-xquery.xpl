<!--
    Copyright (C) 2004 Orbeon, Inc.
  
    This program is free software; you can redistribute it and/or modify it under the terms of the
    GNU Lesser General Public License as published by the Free Software Foundation; either version
    2.1 of the License, or (at your option) any later version.
  
    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Lesser General Public License for more details.
  
    The full text of the license is available at http://www.gnu.org/copyleft/lesser.html
-->
<p:config xmlns:p="http://www.orbeon.com/oxf/pipeline"
    xmlns:saxon="http://saxon.sf.net/"
    xmlns:oxf="http://www.orbeon.com/oxf/processors"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <p:param name="input" type="input"/>
    <p:param name="xquery" type="input"/>
    <p:param name="formatted-output" type="output"/>

    <!-- Parse input document -->
    <p:processor name="oxf:xslt">
        <p:input name="data" href="#input"/>
        <p:input name="config">
            <xsl:stylesheet version="2.0">
                <xsl:template match="/">
                    <xsl:copy-of select="saxon:parse(string(/))"/>
                </xsl:template>
            </xsl:stylesheet>
        </p:input>
        <p:output name="data" id="input-parsed"/>
    </p:processor>
    
    <!-- Prepare the query for the XQuery processor -->
    <p:processor name="oxf:xslt">
        <p:input name="data" href="#xquery"/>
        <p:input name="config">
            <document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      xmlns:xs="http://www.w3.org/2001/XMLSchema"
                        xsl:version="2.0"
                        xsi:type="xs:string">
                <xsl:value-of select="/"/>
            </document>
        </p:input>
        <p:output name="data" id="xquery-prepared"/>
    </p:processor>
    
    <!-- Execute query -->
    <p:processor name="oxf:xquery">
        <p:input name="config" href="#xquery-prepared"/>
        <p:input name="data" href="#input-parsed"/>
        <p:output name="data" id="output"/>
    </p:processor>

    <!-- Format output -->
    <p:processor name="oxf:pipeline">
        <p:input name="config" href="oxf:/config/theme/format.xpl"/>
        <p:input name="data" href="#output"/>
        <p:output name="data" ref="formatted-output"/>
    </p:processor>

</p:config>